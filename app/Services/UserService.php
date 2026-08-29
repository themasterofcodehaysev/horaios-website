<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\WelcomeNotification;
use App\Jobs\SendWelcomeNotification;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class UserService
{
    public function getAllUsers(int $perPage = 15): LengthAwarePaginator
    {
        return User::with('role')->latest()->paginate($perPage);
    }

    public function createUser(array $data, ?User $actingUser = null): User
    {
        $data['uuid'] = (string) Str::uuid();
        $data['password'] = Hash::make($data['password']);
        $data['display_name'] = $data['display_name'] ?? trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));

        $user = User::create($data);

        AuditLogService::log(
            'create',
            'User',
            (string) $user->id,
            null,
            $user->only(['id', 'email', 'role_id', 'status']),
            $actingUser?->id
        );

        // Queue a welcome email carrying a signed password-setup link.
        // The admin-supplied password is never transmitted or persisted in plaintext beyond this request.
        $resetToken = Password::createToken($user);
        SendWelcomeNotification::dispatch($user->id, $resetToken);

        return $user->load('role');
    }

    public function updateUser(User $user, array $data, ?User $actingUser = null): User
    {
        $oldValues = $user->only(['first_name', 'last_name', 'email', 'role_id', 'status', 'phone']);
        $roleChanged = array_key_exists('role_id', $data) && (int) $data['role_id'] !== (int) $user->role_id;

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        $newValues = $user->only(['first_name', 'last_name', 'email', 'role_id', 'status', 'phone']);

        AuditLogService::log(
            'update',
            'User',
            (string) $user->id,
            $oldValues,
            $newValues,
            $actingUser?->id
        );

        if ($roleChanged) {
            AuditLogService::log(
                'role_change',
                'User',
                (string) $user->id,
                ['role_id' => $oldValues['role_id']],
                ['role_id' => $newValues['role_id']],
                $actingUser?->id
            );
        }

        return $user->fresh()->load('role');
    }

    public function deleteUser(User $user, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'User',
            (string) $user->id,
            $user->only(['email', 'display_name', 'status']),
            null,
            $actingUser?->id
        );

        $user->delete();
    }

    /**
     * Toggle a user's status between 'active' and 'inactive'.
     */
    public function toggleStatus(User $user, ?User $actingUser = null): User
    {
        $oldStatus = $user->status;
        $newStatus = $oldStatus === 'active' ? 'inactive' : 'active';
        $action = $newStatus === 'active' ? 'activate' : 'deactivate';

        $user->update(['status' => $newStatus]);

        AuditLogService::log(
            $action,
            'User',
            (string) $user->id,
            ['status' => $oldStatus],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $user->fresh()->load('role');
    }

    /**
     * Trigger a password reset for a user as an admin action. Reuses the same
     * signed-link mechanism as the "forgot password" flow — no plaintext
     * password is ever generated or emailed.
     */
    public function sendPasswordReset(User $user, ?User $actingUser = null): void
    {
        Password::sendResetLink($user->email);

        AuditLogService::log(
            'password_reset_requested',
            'User',
            (string) $user->id,
            null,
            null,
            $actingUser?->id
        );
    }
}
