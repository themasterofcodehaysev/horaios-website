<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\WelcomeNotification;
use App\Notifications\NewUserRegistered;
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
        $displayName = trim((string) ($data['display_name'] ?? ''));
        $data['display_name'] = $displayName !== '' 
            ? $displayName 
            : trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));

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

        // Notify admins about new user registration
        $adminUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['SUPER_ADMIN', 'ADMIN']);
        })->get();

        foreach ($adminUsers as $admin) {
            $admin->notify(new NewUserRegistered($user->display_name, $user->email));
        }

        return $user->load('role');
    }

    public function updateUser(User $user, array $data, ?User $actingUser = null): User
    {
        $oldValues = $user->only(['first_name', 'last_name', 'display_name', 'email', 'role_id', 'status', 'phone']);
        $roleChanged = array_key_exists('role_id', $data) && (int) $data['role_id'] !== (int) $user->role_id;

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $oldFullName = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
        $newFirstName = $data['first_name'] ?? $user->first_name;
        $newLastName = $data['last_name'] ?? $user->last_name;
        $newFullName = trim(($newFirstName ?? '') . ' ' . ($newLastName ?? ''));

        if (array_key_exists('display_name', $data) && trim((string) $data['display_name']) === '') {
            // User cleared display_name or sent empty string -> auto-generate from names
            $data['display_name'] = $newFullName;
        } elseif (array_key_exists('display_name', $data) && $data['display_name'] !== null) {
            // If the submitted display_name was identical to the old full name and names changed, sync to new full name
            if ($data['display_name'] === $oldFullName && $newFullName !== $oldFullName) {
                $data['display_name'] = $newFullName;
            } else {
                $data['display_name'] = trim((string) $data['display_name']);
            }
        } elseif (array_key_exists('first_name', $data) || array_key_exists('last_name', $data)) {
            // No display_name in payload, but first/last name changed: sync if display_name was default
            if (empty($user->display_name) || $user->display_name === $oldFullName) {
                $data['display_name'] = $newFullName;
            }
        }

        $user->update($data);

        $newValues = $user->only(['first_name', 'last_name', 'display_name', 'email', 'role_id', 'status', 'phone']);

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
