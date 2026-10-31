<?php

namespace App\Policies;

use App\Models\NavigationMenu;
use App\Models\User;

class NavigationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('settings.manage');
    }

    public function view(User $user, NavigationMenu $menu): bool
    {
        return $user->isEditor() || $user->hasPermission('settings.manage');
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('settings.manage');
    }

    public function update(User $user, ?NavigationMenu $menu = null): bool
    {
        return $user->isEditor() || $user->hasPermission('settings.manage');
    }

    public function delete(User $user, NavigationMenu $menu): bool
    {
        return $user->isAdmin() || $user->hasPermission('settings.manage');
    }
}
