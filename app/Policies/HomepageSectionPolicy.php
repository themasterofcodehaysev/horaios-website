<?php

namespace App\Policies;

use App\Models\HomepageSection;
use App\Models\User;

class HomepageSectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('homepage.manage');
    }

    public function view(User $user, HomepageSection $section): bool
    {
        return $user->isEditor() || $user->hasPermission('homepage.manage');
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('homepage.manage');
    }

    public function update(User $user, ?HomepageSection $section = null): bool
    {
        return $user->isEditor() || $user->hasPermission('homepage.manage');
    }

    public function delete(User $user, HomepageSection $section): bool
    {
        return $user->isAdmin() || $user->hasPermission('homepage.manage');
    }
}
