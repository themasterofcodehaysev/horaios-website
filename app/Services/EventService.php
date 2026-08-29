<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class EventService
{
    public function getPublicEvents(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $today = now()->toDateString();
        $now = now();

        $query = Event::with(['category'])
            ->where('status', 'published')
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('description', 'like', $term)
                        ->orWhere('location', 'like', $term)
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['category_slug']), function ($q) use ($filters) {
                $q->whereHas('category', fn($catQ) => $catQ->where('slug', $filters['category_slug']));
            })
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->when(!empty($filters['start_date_from']), fn($q) => $q->whereDate('start_date', '>=', $filters['start_date_from']))
            ->when(!empty($filters['start_date_to']), fn($q) => $q->whereDate('start_date', '<=', $filters['start_date_to']))
            ->when(!empty($filters['scope']), function ($q) use ($filters, $today, $now) {
                $scope = $filters['scope'];
                if ($scope === 'upcoming') {
                    $q->where(function ($sub) use ($today, $now) {
                        $sub->whereDate('start_date', '>', $today)
                            ->orWhere(function ($todaySub) use ($today, $now) {
                                $todaySub->whereDate('start_date', '=', $today)
                                    ->whereTime('start_time', '>=', $now->toTimeString());
                            });
                    });
                } elseif ($scope === 'past') {
                    $q->where(function ($sub) use ($today, $now) {
                        $sub->whereDate('end_date', '<', $today)
                            ->orWhere(function ($todaySub) use ($today, $now) {
                                $todaySub->whereDate('end_date', '=', $today)
                                    ->whereTime('end_time', '<=', $now->toTimeString());
                            });
                    });
                }
            })
            ->orderBy('featured', 'desc')
            ->orderBy('start_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function getAdminEvents(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Event::with(['category', 'creator', 'updater'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('description', 'like', $term)
                        ->orWhere('location', 'like', $term)
                        ->orWhereHas('category', fn($ca) => $ca->where('name', 'like', $term));
                });
            })
            ->when(!empty($filters['category_id']), fn($q) => $q->where('category_id', $filters['category_id']))
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['featured']) && $filters['featured'] !== '', fn($q) => $q->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createEvent(array $data, ?User $actingUser = null): Event
    {
        $data['uuid'] = (string) Str::uuid();
        $data['created_by'] = $actingUser?->id;
        $data['updated_by'] = $actingUser?->id;

        if (empty($data['slug'])) {
            $data['slug'] = Event::generateUniqueSlug($data['title']);
        }

        if (($data['status'] ?? 'draft') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $event = Event::create($data);

        AuditLogService::log(
            'create',
            'Event',
            (string) $event->id,
            null,
            $event->only(['id', 'title', 'slug', 'status', 'featured']),
            $actingUser?->id
        );

        return $event->load(['category']);
    }

    public function updateEvent(Event $event, array $data, ?User $actingUser = null): Event
    {
        $oldValues = $event->only(['title', 'slug', 'category_id', 'status', 'featured', 'start_date', 'end_date']);
        $data['updated_by'] = $actingUser?->id;

        if (!empty($data['title']) && empty($data['slug']) && $data['title'] !== $event->title) {
            $data['slug'] = Event::generateUniqueSlug($data['title'], $event->id);
        }

        if (isset($data['status']) && $data['status'] === 'published' && empty($event->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $event->update($data);

        AuditLogService::log(
            'update',
            'Event',
            (string) $event->id,
            $oldValues,
            $event->only(['title', 'slug', 'category_id', 'status', 'featured', 'start_date', 'end_date']),
            $actingUser?->id
        );

        return $event->fresh(['category', 'creator', 'updater']);
    }

    public function deleteEvent(Event $event, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'Event',
            (string) $event->id,
            $event->only(['title', 'slug', 'status']),
            null,
            $actingUser?->id
        );

        $event->delete();
    }

    public function togglePublish(Event $event, ?User $actingUser = null): Event
    {
        $newStatus = $event->status === 'published' ? 'draft' : 'published';
        $action = $newStatus === 'published' ? 'publish' : 'unpublish';

        $updateData = [
            'status'     => $newStatus,
            'updated_by' => $actingUser?->id,
        ];

        if ($newStatus === 'published' && empty($event->published_at)) {
            $updateData['published_at'] = now();
        }

        $event->update($updateData);

        AuditLogService::log(
            $action,
            'Event',
            (string) $event->id,
            ['status' => $event->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $event->fresh(['category']);
    }

    public function toggleFeatured(Event $event, ?User $actingUser = null): Event
    {
        $newFeatured = !$event->featured;
        $action = $newFeatured ? 'feature' : 'unfeature';

        $event->update([
            'featured'   => $newFeatured,
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            $action,
            'Event',
            (string) $event->id,
            ['featured' => !$newFeatured],
            ['featured' => $newFeatured],
            $actingUser?->id
        );

        return $event->fresh(['category']);
    }

    public function duplicateEvent(Event $event, ?User $actingUser = null): Event
    {
        $newTitle = $event->title . ' (Copy)';
        $newSlug = Event::generateUniqueSlug($newTitle);

        $duplicate = Event::create([
            'uuid'                => (string) Str::uuid(),
            'title'               => $newTitle,
            'slug'                => $newSlug,
            'description'         => $event->description,
            'featured_image'      => $event->featured_image,
            'category_id'         => $event->category_id,
            'location'            => $event->location,
            'google_map_url'      => $event->google_map_url,
            'start_date'          => $event->start_date,
            'end_date'            => $event->end_date,
            'start_time'          => $event->start_time,
            'end_time'            => $event->end_time,
            'registration_required' => $event->registration_required,
            'registration_limit'  => $event->registration_limit,
            'featured'            => false,
            'status'              => 'draft',
            'created_by'          => $actingUser?->id,
            'updated_by'          => $actingUser?->id,
        ]);

        AuditLogService::log(
            'duplicate',
            'Event',
            (string) $duplicate->id,
            ['original_id' => $event->id],
            ['duplicate_id' => $duplicate->id],
            $actingUser?->id
        );

        return $duplicate->load(['category']);
    }

    public function cancelEvent(Event $event, ?User $actingUser = null): Event
    {
        $oldStatus = $event->status;
        $event->update([
            'status'     => 'cancelled',
            'updated_by' => $actingUser?->id,
        ]);

        AuditLogService::log(
            'cancel',
            'Event',
            (string) $event->id,
            ['status' => $oldStatus],
            ['status' => 'cancelled'],
            $actingUser?->id
        );

        return $event->fresh(['category']);
    }

    public function getRelatedEvents(Event $event, int $limit = 5)
    {
        return Event::with(['category'])
            ->where('status', 'published')
            ->where('id', '!=', $event->id)
            ->where(function ($q) use ($event) {
                if ($event->category_id) {
                    $q->orWhere('category_id', $event->category_id);
                }
            })
            ->orderBy('featured', 'desc')
            ->orderBy('start_date', 'asc')
            ->limit($limit)
            ->get();
    }
}
