<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\User;

class MediaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('media.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('media.manage');
    }

    public function delete(User $user, Media $media): bool
    {
        return $user->hasPermission('media.manage');
    }
}
