<?php

namespace App\Policies;

use App\Models\SongCategory;
use App\Models\User;

class SongCategoryPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, SongCategory $category): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('songs.manage');
    }

    public function update(User $user, SongCategory $category): bool
    {
        return $user->isEditor() || $user->hasPermission('songs.manage');
    }

    public function delete(User $user, SongCategory $category): bool
    {
        return $user->isAdmin() || $user->hasPermission('songs.manage');
    }
}
