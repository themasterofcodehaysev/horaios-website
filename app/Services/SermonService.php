<?php

namespace App\Services;

use App\Models\Sermon;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class SermonService
{
    public function getPublicSermons(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Sermon::with(['speaker', 'series', 'category'])
            ->where('status', 'published')
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('summary', 'like', $term)
                        ->orWhere('description', 'like', $term)
                        ->orWhere('scripture_reference', 'like', $term)
                        ->orWhereHas('speaker', fn($sp) => $sp->where('name', 'like', $term))
                        ->orWhereHas('series', fn($se) => $se->where('name', 'like', $term))
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['speaker_id']), fn($q) => $q->where('speaker_id', $filters['speaker_id']))
            ->when(!empty($filters['series_id']), fn($q) => $q->where('series_id', $filters['series_id']))
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

    public function getAdminSermons(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Sermon::with(['speaker', 'series', 'category', 'creator', 'updater'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('summary', 'like', $term)
                        ->orWhere('scripture_reference', 'like', $term)
                        ->orWhereHas('speaker', fn($sp) => $sp->where('name', 'like', $term))
                        ->orWhereHas('series', fn($se) => $se->where('name', 'like', $term))
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['speaker_id']), fn($q) => $q->where('speaker_id', $filters['speaker_id']))
            ->when(!empty($filters['series_id']), fn($q) => $q->where('series_id', $filters['series_id']))
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createSermon(array $data, ?User $actingUser = null): Sermon
    {
        $data['uuid'] = (string) Str::uuid();
        $data['created_by'] = $actingUser?->id;
        $data['updated_by'] = $actingUser?->id;

        if (empty($data['slug'])) {
            $data['slug'] = Sermon::generateUniqueSlug($data['title']);
        }

        if (($data['status'] ?? 'draft') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $sermon = Sermon::create($data);

        AuditLogService::log(
            'create',
            'Sermon',
            (string) $sermon->id,
            null,
            $sermon->only(['id', 'title', 'slug', 'status', 'featured']),
            $actingUser?->id
        );

        return $sermon->load(['speaker', 'series', 'category']);
    }

    public function updateSermon(Sermon $sermon, array $data, ?User $actingUser = null): Sermon
    {
        $oldValues = $sermon->only(['title', 'slug', 'speaker_id', 'series_id', 'category_id', 'status', 'featured']);
        $data['updated_by'] = $actingUser?->id;

        if (!empty($data['title']) && empty($data['slug']) && $data['title'] !== $sermon->title) {
            $data['slug'] = Sermon::generateUniqueSlug($data['title'], $sermon->id);
        }

        if (isset($data['status']) && $data['status'] === 'published' && empty($sermon->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $sermon->update($data);

        AuditLogService::log(
            'update',
            'Sermon',
            (string) $sermon->id,
            $oldValues,
            $sermon->only(['title', 'slug', 'speaker_id', 'series_id', 'category_id', 'status', 'featured']),
            $actingUser?->id
        );

        return $sermon->fresh(['speaker', 'series', 'category', 'creator', 'updater']);
    }

    public function deleteSermon(Sermon $sermon, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'Sermon',
            (string) $sermon->id,
            $sermon->only(['title', 'slug', 'status']),
            null,
            $actingUser?->id
        );

        $sermon->delete();
    }

    public function togglePublish(Sermon $sermon, ?User $actingUser = null): Sermon
    {
        $newStatus = $sermon->status === 'published' ? 'draft' : 'published';
        $action = $newStatus === 'published' ? 'publish' : 'unpublish';

        $updateData = [
            'status'     => $newStatus,
            'updated_by' => $actingUser?->id,
        ];

        if ($newStatus === 'published' && empty($sermon->published_at)) {
            $updateData['published_at'] = now();
        }

        $sermon->update($updateData);

        AuditLogService::log(
            $action,
            'Sermon',
            (string) $sermon->id,
            ['status' => $sermon->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $sermon->fresh(['speaker', 'series', 'category']);
    }

    public function toggleFeatured(Sermon $sermon, ?User $actingUser = null): Sermon
    {
        $newFeatured = !$sermon->featured;
        $action = $newFeatured ? 'feature' : 'unfeature';

        $sermon->update([
            'featured'   => $newFeatured,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            $action,
            'Sermon',
            (string) $sermon->id,
            ['featured' => !$newFeatured],
            ['featured' => $newFeatured],
            $actingUser?->id
        );

        return $sermon->fresh(['speaker', 'series', 'category']);
    }

    public function duplicateSermon(Sermon $sermon, ?User $actingUser = null): Sermon
    {
        $newTitle = $sermon->title . ' (Copy)';
        $newSlug = Sermon::generateUniqueSlug($newTitle);

        $duplicate = Sermon::create([
            'uuid'                => (string) Str::uuid(),
            'title'               => $newTitle,
            'slug'                => $newSlug,
            'summary'             => $sermon->summary,
            'description'         => $sermon->description,
            'speaker_id'          => $sermon->speaker_id,
            'series_id'           => $sermon->series_id,
            'category_id'         => $sermon->category_id,
            'scripture_reference' => $sermon->scripture_reference,
            'youtube_url'         => $sermon->youtube_url,
            'thumbnail'           => $sermon->thumbnail,
            'featured'            => false,
            'status'              => 'draft',
            'display_order'       => $sermon->display_order + 1,
            'created_by'          => $actingUser?->id,
            'updated_by'          => $actingUser?->id,
        ]);

        AuditLogService::log(
            'duplicate',
            'Sermon',
            (string) $duplicate->id,
            ['original_id' => $sermon->id],
            ['duplicate_id' => $duplicate->id],
            $actingUser?->id
        );

        return $duplicate->load(['speaker', 'series', 'category']);
    }

    public function getRelatedSermons(Sermon $sermon, int $limit = 5)
    {
        return Sermon::with(['speaker', 'series', 'category'])
            ->where('status', 'published')
            ->where('id', '!=', $sermon->id)
            ->where(function ($q) use ($sermon) {
                if ($sermon->series_id) {
                    $q->orWhere('series_id', $sermon->series_id);
                }
                if ($sermon->category_id) {
                    $q->orWhere('category_id', $sermon->category_id);
                }
                if ($sermon->speaker_id) {
                    $q->orWhere('speaker_id', $sermon->speaker_id);
                }
            })
            ->orderBy('featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
