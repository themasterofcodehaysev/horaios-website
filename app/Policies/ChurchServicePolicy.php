<?php

namespace App\Policies;

use App\Models\ChurchService;
use App\Models\User;

class ChurchServicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('services.manage');
    }

    public function view(User $user, ChurchService $service): bool
    {
        return $user->isEditor() || $user->hasPermission('services.manage');
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('services.manage');
    }

    public function update(User $user, ?ChurchService $service = null): bool
    {
        return $user->isEditor() || $user->hasPermission('services.manage');
    }

    public function delete(User $user, ChurchService $service): bool
    {
        return $user->isAdmin() || $user->hasPermission('services.manage');
    }
}
