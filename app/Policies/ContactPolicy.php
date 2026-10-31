<?php

namespace App\Policies;

use App\Models\ContactMessage;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('contact_messages.view') || $user->hasPermission('ministries.manage');
    }

    public function view(User $user, ContactMessage $message): bool
    {
        return $user->isEditor() || $user->hasPermission('contact_messages.view') || $user->hasPermission('ministries.manage');
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('contact_messages.create');
    }

    public function update(User $user, ContactMessage $message): bool
    {
        return $user->isEditor() || $user->hasPermission('contact_messages.edit') || $user->hasPermission('ministries.manage');
    }

    public function delete(User $user, ContactMessage $message): bool
    {
        return $user->isAdmin() || $user->hasPermission('contact_messages.delete') || $user->hasPermission('ministries.manage');
    }
}
