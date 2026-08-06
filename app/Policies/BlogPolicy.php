<?php

namespace App\Policies;

use App\Models\BlogPost;
use App\Models\User;

class BlogPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, BlogPost $post): bool
    {
        if ($post->status === 'published') {
            return true;
        }

        return $user !== null && ($user->isEditor() || $user->hasPermission('blog.manage'));
    }

    public function create(User $user): bool
    {
        return $user->isEditor() || $user->hasPermission('blog.manage');
    }

    public function update(User $user, BlogPost $post): bool
    {
        return $user->isEditor() || $user->hasPermission('blog.manage');
    }

    public function delete(User $user, BlogPost $post): bool
    {
        return $user->isAdmin() || $user->hasPermission('blog.manage');
    }
}
