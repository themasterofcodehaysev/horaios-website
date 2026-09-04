<?php

namespace App\Policies;

use App\Models\Song;
use App\Models\User;

class SongPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Song $song): bool
    {
        if ($song->status === 'published') {
            return true;
        }

        if ($user !== null && $user->isSuperAdmin()) {
            return true;
        }

        return $user !== null && ($user->isEditor() || $user->hasPermission('songs.manage'));
    }

    public function create(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('songs.manage');
    }

    public function update(User $user, Song $song): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isEditor() || $user->hasPermission('songs.manage');
    }

    public function delete(User $user, Song $song): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isAdmin() || $user->hasPermission('songs.manage');
    }
}
