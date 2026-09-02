<?php

namespace App\Policies;

use App\Models\NavigationMenuItem;
use App\Models\User;

class NavigationMenuItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('navigation.manage');
    }

    public function view(User $user, NavigationMenuItem $item): bool
    {
        return $user->isEditor() || $user->hasPermission('navigation.manage');
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('navigation.manage');
    }

    public function update(User $user, NavigationMenuItem $item): bool
    {
        return $user->isEditor() || $user->hasPermission('navigation.manage');
    }

    public function delete(User $user, NavigationMenuItem $item): bool
    {
        return $user->isAdmin() || $user->hasPermission('navigation.manage');
    }
}