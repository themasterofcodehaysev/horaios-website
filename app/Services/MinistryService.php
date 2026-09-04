<?php

namespace App\Services;

use App\Models\Ministry;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class MinistryService
{
    public function getPublicMinistries(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Ministry::with(['category'])
            ->where('status', 'published')
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'like', $term)
                        ->orWhere('description', 'like', $term)
                        ->orWhere('leader', 'like', $term)
                        ->orWhere('meeting_day', 'like', $term)
                        ->orWhere('location', 'like', $term)
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('featured', 'desc')
            ->orderBy('display_order', 'asc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function getAdminMinistries(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Ministry::with(['category', 'creator', 'updater'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'like', $term)
                        ->orWhere('description', 'like', $term)
                        ->orWhere('leader', 'like', $term)
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createMinistry(array $data, ?User $actingUser = null): Ministry
    {
        $data['uuid'] = (string) Str::uuid();
        $data['created_by'] = $actingUser?->id;
        $data['updated_by'] = $actingUser?->id;

        if (($data['status'] ?? 'draft') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $ministry = Ministry::create($data);

        AuditLogService::log(
            'create',
            'Ministry',
            (string) $ministry->id,
            null,
            $ministry->only(['id', 'name', 'status', 'featured']),
            $actingUser?->id
        );

        return $ministry->load(['category']);
    }

    public function updateMinistry(Ministry $ministry, array $data, ?User $actingUser = null): Ministry
    {
        $oldValues = $ministry->only(['name', 'category_id', 'status', 'featured', 'display_order']);
        $data['updated_by'] = $actingUser?->id;

        if (isset($data['status']) && $data['status'] === 'published' && empty($ministry->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $ministry->update($data);

        AuditLogService::log(
            'update',
            'Ministry',
            (string) $ministry->id,
            $oldValues,
            $ministry->only(['name', 'category_id', 'status', 'featured', 'display_order']),
            $actingUser?->id
        );

        return $ministry->fresh(['category', 'creator', 'updater']);
    }

    public function deleteMinistry(Ministry $ministry, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'Ministry',
            (string) $ministry->id,
            $ministry->only(['name', 'status']),
            null,
            $actingUser?->id
        );

        $ministry->delete();
    }

    public function togglePublish(Ministry $ministry, ?User $actingUser = null): Ministry
    {
        $newStatus = $ministry->status === 'published' ? 'draft' : 'published';
        $action = $newStatus === 'published' ? 'publish' : 'unpublish';

        $updateData = [
            'status'     => $newStatus,
            'updated_by' => $actingUser?->id,
        ];

        if ($newStatus === 'published' && empty($ministry->published_at)) {
            $updateData['published_at'] = now();
        }

        $ministry->update($updateData);

        AuditLogService::log(
            $action,
            'Ministry',
            (string) $ministry->id,
            ['status' => $ministry->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $ministry->fresh(['category']);
    }

    public function toggleFeatured(Ministry $ministry, ?User $actingUser = null): Ministry
    {
        $newFeatured = !$postFeatured = $ministry->featured;
        $action = !$postFeatured ? 'feature' : 'unfeature';

        $ministry->update([
            'featured'   => !$postFeatured,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            $action,
            'Ministry',
            (string) $ministry->id,
            ['featured' => $postFeatured],
            ['featured' => !$postFeatured],
            $actingUser?->id
        );

        return $ministry->fresh(['category']);
    }

    public function duplicateMinistry(Ministry $ministry, ?User $actingUser = null): Ministry
    {
        $newName = $ministry->name . ' (Copy)';

        $duplicate = Ministry::create([
            'uuid'           => (string) Str::uuid(),
            'name'           => $newName,
            'description'    => $ministry->description,
            'leader'         => $ministry->leader,
            'email'          => $ministry->email,
            'phone'          => $ministry->phone,
            'featured_image' => $ministry->featured_image,
            'category_id'    => $ministry->category_id,
            'meeting_day'    => $ministry->meeting_day,
            'meeting_time'   => $ministry->meeting_time,
            'location'       => $ministry->location,
            'featured'       => false,
            'status'         => 'draft',
            'display_order'  => ($ministry->display_order ?? 0) + 1,
            'created_by'     => $actingUser?->id,
            'updated_by'     => $actingUser?->id,
        ]);

        AuditLogService::log(
            'duplicate',
            'Ministry',
            (string) $duplicate->id,
            ['original_id' => $ministry->id],
            ['duplicate_id' => $duplicate->id],
            $actingUser?->id
        );

        return $duplicate->load(['category']);
    }

    public function reorderMinistry(Ministry $ministry, int $displayOrder, ?User $actingUser = null): Ministry
    {
        $oldOrder = $ministry->display_order;

        $ministry->update([
            'display_order' => $displayOrder,
            'updated_by'    => $actingUser?->id,
        ]);

        AuditLogService::log(
            'reorder',
            'Ministry',
            (string) $ministry->id,
            ['display_order' => $oldOrder],
            ['display_order' => $displayOrder],
            $actingUser?->id
        );

        return $ministry;
    }

    public function getRelatedMinistries(Ministry $ministry, int $limit = 5)
    {
        return Ministry::with(['category'])
            ->where('status', 'published')
            ->where('id', '!=', $ministry->id)
            ->where(function ($q) use ($ministry) {
                if ($ministry->category_id) {
                    $q->orWhere('category_id', $ministry->category_id);
                }
            })
            ->orderBy('featured', 'desc')
            ->orderBy('display_order', 'asc')
            ->limit($limit)
            ->get();
    }
}
