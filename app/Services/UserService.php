<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
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

        return $user->load('role');
    }

    public function updateUser(User $user, array $data, ?User $actingUser = null): User
    {
        $oldValues = $user->only(['first_name', 'last_name', 'email', 'role_id', 'status', 'phone']);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        AuditLogService::log(
            'update',
            'User',
            (string) $user->id,
            $oldValues,
            $user->only(['first_name', 'last_name', 'email', 'role_id', 'status', 'phone']),
            $actingUser?->id
        );

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
}
