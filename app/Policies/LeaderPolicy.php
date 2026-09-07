<?php

namespace App\Policies;

use App\Models\Leader;
use App\Models\User;

class LeaderPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Leader $leader): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('settings.manage') || $user->hasPermission('homepage.manage');
    }

    public function update(User $user, Leader $leader): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('settings.manage') || $user->hasPermission('homepage.manage');
    }

    public function delete(User $user, Leader $leader): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isAdmin() || $user->hasPermission('settings.manage') || $user->hasPermission('homepage.manage');
    }
}
