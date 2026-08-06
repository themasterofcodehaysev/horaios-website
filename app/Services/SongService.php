<?php

namespace App\Services;

use App\Models\Song;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class SongService
{
    public function getPublicSongs(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Song::with('category')
            ->where('status', 'published')
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('artist', 'like', $term)
                        ->orWhere('composer', 'like', $term)
                        ->orWhere('lyrics', 'like', $term);
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['category_slug']), function ($q) use ($filters) {
                $q->whereHas('category', fn($catQ) => $catQ->where('slug', $filters['category_slug']));
            })
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('featured', 'desc')
            ->orderBy('display_order', 'asc')
            ->orderBy('title', 'asc');

        return $query->paginate($perPage);
    }

    public function getAdminSongs(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Song::with(['category', 'creator', 'updater'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('artist', 'like', $term)
                        ->orWhere('composer', 'like', $term)
                        ->orWhere('lyrics', 'like', $term);
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy($filters['sort_by'] ?? 'updated_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createSong(array $data, ?User $actingUser = null): Song
    {
        $data['uuid'] = (string) Str::uuid();
        $data['created_by'] = $actingUser?->id;
        $data['updated_by'] = $actingUser?->id;

        if (empty($data['slug'])) {
            $data['slug'] = Song::generateUniqueSlug($data['title']);
        }

        $song = Song::create($data);

        AuditLogService::log(
            'create',
            'Song',
            (string) $song->id,
            null,
            $song->only(['id', 'title', 'slug', 'status', 'featured']),
            $actingUser?->id
        );

        return $song->load('category');
    }

    public function updateSong(Song $song, array $data, ?User $actingUser = null): Song
    {
        $oldValues = $song->only(['title', 'slug', 'artist', 'composer', 'category_id', 'status', 'featured']);
        $data['updated_by'] = $actingUser?->id;

        if (!empty($data['title']) && empty($data['slug']) && $data['title'] !== $song->title) {
            $data['slug'] = Song::generateUniqueSlug($data['title'], $song->id);
        }

        $song->update($data);

        AuditLogService::log(
            'update',
            'Song',
            (string) $song->id,
            $oldValues,
            $song->only(['title', 'slug', 'artist', 'composer', 'category_id', 'status', 'featured']),
            $actingUser?->id
        );

        return $song->fresh(['category', 'creator', 'updater']);
    }

    public function deleteSong(Song $song, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'Song',
            (string) $song->id,
            $song->only(['title', 'slug', 'status']),
            null,
            $actingUser?->id
        );

        $song->delete();
    }

    public function togglePublish(Song $song, ?User $actingUser = null): Song
    {
        $newStatus = $song->status === 'published' ? 'draft' : 'published';
        $action = $newStatus === 'published' ? 'publish' : 'unpublish';

        $song->update([
            'status' => $newStatus,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            $action,
            'Song',
            (string) $song->id,
            ['status' => $song->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $song;
    }

    public function toggleFeatured(Song $song, ?User $actingUser = null): Song
    {
        $newFeatured = !$song->featured;
        $action = $newFeatured ? 'feature' : 'unfeature';

        $song->update([
            'featured' => $newFeatured,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            $action,
            'Song',
            (string) $song->id,
            ['featured' => !$newFeatured],
            ['featured' => $newFeatured],
            $actingUser?->id
        );

        return $song;
    }

    public function duplicateSong(Song $song, ?User $actingUser = null): Song
    {
        $newTitle = $song->title . ' (Copy)';
        $newSlug = Song::generateUniqueSlug($newTitle);

        $duplicate = Song::create([
            'uuid' => (string) Str::uuid(),
            'title' => $newTitle,
            'slug' => $newSlug,
            'artist' => $song->artist,
            'composer' => $song->composer,
            'category_id' => $song->category_id,
            'lyrics' => $song->lyrics,
            'featured' => false,
            'status' => 'draft',
            'display_order' => $song->display_order + 1,
            'created_by' => $actingUser?->id,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            'duplicate',
            'Song',
            (string) $duplicate->id,
            ['original_id' => $song->id],
            ['duplicate_id' => $duplicate->id],
            $actingUser?->id
        );

        return $duplicate->load('category');
    }
}
