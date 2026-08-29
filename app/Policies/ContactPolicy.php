<?php

namespace App\Policies;

use App\Models\ContactMessage;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('contact_messages.view');
    }

    public function view(User $user, ContactMessage $message): bool
    {
        return $user->can('contact_messages.view');
    }

    public function create(User $user): bool
    {
        return $user->can('contact_messages.create');
    }

    public function update(User $user, ContactMessage $message): bool
    {
        return $user->can('contact_messages.edit');
    }

    public function delete(User $user, ContactMessage $message): bool
    {
        return $user->can('contact_messages.delete');
    }
}
