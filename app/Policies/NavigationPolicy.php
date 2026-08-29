<?php

namespace App\Policies;

use App\Models\NavigationMenu;
use App\Models\User;

class NavigationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('navigation.manage');
    }

    public function view(User $user, NavigationMenu $menu): bool
    {
        return $user->can('navigation.manage');
    }

    public function create(User $user): bool
    {
        return $user->can('navigation.manage');
    }

    public function update(User $user, NavigationMenu $menu): bool
    {
        return $user->can('navigation.manage');
    }

    public function delete(User $user, NavigationMenu $menu): bool
    {
        return $user->can('navigation.manage');
    }
}
