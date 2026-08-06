<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BlogService
{
    public function getPublicPosts(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = BlogPost::with(['category'])
            ->where('status', 'published')
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('excerpt', 'like', $term)
                        ->orWhere('content', 'like', $term)
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['category_slug']), function ($q) use ($filters) {
                $q->whereHas('category', fn($catQ) => $catQ->where('slug', $filters['category_slug']));
            })
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function getAdminPosts(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = BlogPost::with(['category', 'creator', 'updater'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('excerpt', 'like', $term)
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createPost(array $data, ?User $actingUser = null): BlogPost
    {
        $data['uuid'] = (string) Str::uuid();
        $data['created_by'] = $actingUser?->id;
        $data['updated_by'] = $actingUser?->id;

        if (empty($data['slug'])) {
            $data['slug'] = BlogPost::generateUniqueSlug($data['title']);
        }

        if (($data['status'] ?? 'draft') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = BlogPost::create($data);

        AuditLogService::log(
            'create',
            'BlogPost',
            (string) $post->id,
            null,
            $post->only(['id', 'title', 'slug', 'status', 'featured']),
            $actingUser?->id
        );

        return $post->load(['category']);
    }

    public function updatePost(BlogPost $post, array $data, ?User $actingUser = null): BlogPost
    {
        $oldValues = $post->only(['title', 'slug', 'category_id', 'status', 'featured']);
        $data['updated_by'] = $actingUser?->id;

        if (!empty($data['title']) && empty($data['slug']) && $data['title'] !== $post->title) {
            $data['slug'] = BlogPost::generateUniqueSlug($data['title'], $post->id);
        }

        if (isset($data['status']) && $data['status'] === 'published' && empty($post->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post->update($data);

        AuditLogService::log(
            'update',
            'BlogPost',
            (string) $post->id,
            $oldValues,
            $post->only(['title', 'slug', 'category_id', 'status', 'featured']),
            $actingUser?->id
        );

        return $post->fresh(['category', 'creator', 'updater']);
    }

    public function deletePost(BlogPost $post, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'BlogPost',
            (string) $post->id,
            $post->only(['title', 'slug', 'status']),
            null,
            $actingUser?->id
        );

        $post->delete();
    }

    public function togglePublish(BlogPost $post, ?User $actingUser = null): BlogPost
    {
        $newStatus = $post->status === 'published' ? 'draft' : 'published';
        $action = $newStatus === 'published' ? 'publish' : 'unpublish';

        $updateData = [
            'status'     => $newStatus,
            'updated_by' => $actingUser?->id,
        ];

        if ($newStatus === 'published' && empty($post->published_at)) {
            $updateData['published_at'] = now();
        }

        $post->update($updateData);

        AuditLogService::log(
            $action,
            'BlogPost',
            (string) $post->id,
            ['status' => $post->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $post->fresh(['category']);
    }

    public function toggleFeatured(BlogPost $post, ?User $actingUser = null): BlogPost
    {
        $newFeatured = !$post->featured;
        $action = $newFeatured ? 'feature' : 'unfeature';

        $post->update([
            'featured'   => $newFeatured,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            $action,
            'BlogPost',
            (string) $post->id,
            ['featured' => !$newFeatured],
            ['featured' => $newFeatured],
            $actingUser?->id
        );

        return $post->fresh(['category']);
    }

    public function duplicatePost(BlogPost $post, ?User $actingUser = null): BlogPost
    {
        $newTitle = $post->title . ' (Copy)';
        $newSlug = BlogPost::generateUniqueSlug($newTitle);

        $duplicate = BlogPost::create([
            'uuid'           => (string) Str::uuid(),
            'title'          => $newTitle,
            'slug'           => $newSlug,
            'excerpt'        => $post->excerpt,
            'content'        => $post->content,
            'featured_image' => $post->featured_image,
            'category_id'    => $post->category_id,
            'featured'       => false,
            'status'         => 'draft',
            'created_by'     => $actingUser?->id,
            'updated_by'     => $actingUser?->id,
        ]);

        AuditLogService::log(
            'duplicate',
            'BlogPost',
            (string) $duplicate->id,
            ['original_id' => $post->id],
            ['duplicate_id' => $duplicate->id],
            $actingUser?->id
        );

        return $duplicate->load(['category']);
    }

    public function getRelatedPosts(BlogPost $post, int $limit = 5)
    {
        return BlogPost::with(['category'])
            ->where('status', 'published')
            ->where('id', '!=', $post->id)
            ->where(function ($q) use ($post) {
                if ($post->category_id) {
                    $q->orWhere('category_id', $post->category_id);
                }
            })
            ->orderBy('featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
