<?php

namespace App\Policies;

use App\Models\Ministry;
use App\Models\User;

class MinistryPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Ministry $ministry): bool
    {
        if ($ministry->status === 'published') {
            return true;
        }

        if ($user !== null && $user->isSuperAdmin()) {
            return true;
        }

        return $user !== null && ($user->isEditor() || $user->hasPermission('ministries.manage'));
    }

    public function create(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('ministries.manage');
    }

    public function update(User $user, Ministry $ministry): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('ministries.manage');
    }

    public function delete(User $user, Ministry $ministry): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isAdmin() || $user->hasPermission('ministries.manage');
    }
}
