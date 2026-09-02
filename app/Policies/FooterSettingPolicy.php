<?php

namespace App\Policies;

use App\Models\FooterSetting;
use App\Models\User;

class FooterSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('footer.manage');
    }

    public function view(User $user, FooterSetting $setting): bool
    {
        return $user->isEditor() || $user->hasPermission('footer.manage');
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('footer.manage');
    }

    public function update(User $user, ?FooterSetting $setting = null): bool
    {
        return $user->isEditor() || $user->hasPermission('footer.manage');
    }

    public function delete(User $user, FooterSetting $setting): bool
    {
        return $user->isAdmin() || $user->hasPermission('footer.manage');
    }
}
