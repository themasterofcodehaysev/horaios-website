<?php

namespace App\Policies;

use App\Models\Sermon;
use App\Models\User;

class SermonPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Sermon $sermon): bool
    {
        if ($sermon->status === 'published') {
            return true;
        }

        if ($user !== null && $user->isSuperAdmin()) {
            return true;
        }

        return $user !== null && ($user->isEditor() || $user->hasPermission('sermons.manage'));
    }

    public function create(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('sermons.manage');
    }

    public function update(User $user, Sermon $sermon): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('sermons.manage');
    }

    public function delete(User $user, Sermon $sermon): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isAdmin() || $user->hasPermission('sermons.manage');
    }
}
