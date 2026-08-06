<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('users.view');
    }

    public function view(User $user, User $targetUser): bool
    {
        return $user->hasPermission('users.view') || $user->id === $targetUser->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('users.create');
    }

    public function update(User $user, User $targetUser): bool
    {
        return $user->hasPermission('users.edit') || $user->id === $targetUser->id;
    }

    public function delete(User $user, User $targetUser): bool
    {
        if ($targetUser->isSuperAdmin()) {
            return false;
        }

        return $user->hasPermission('users.delete');
    }
}
