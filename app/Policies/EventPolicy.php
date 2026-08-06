<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Event $event): bool
    {
        if ($event->status === 'published') {
            return true;
        }

        return $user !== null && ($user->isEditor() || $user->hasPermission('events.manage'));
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('events.manage');
    }

    public function update(User $user, Event $event): bool
    {
        return $user->isEditor() || $user->hasPermission('events.manage');
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->isAdmin() || $user->hasPermission('events.manage');
    }
}
