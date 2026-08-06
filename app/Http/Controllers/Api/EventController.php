<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Event\CreateEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class EventController extends BaseApiController
{
    public function __construct(protected EventService $eventService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $events = $this->eventService->getPublicEvents([
            'search'          => $request->input('search'),
            'category_id'     => $request->input('category_id'),
            'category_slug'   => $request->input('category_slug'),
            'featured'        => $request->input('featured'),
            'start_date_from' => $request->input('start_date_from'),
            'start_date_to'   => $request->input('start_date_to'),
        ], $request->input('per_page', 12));

        return $this->paginated(EventResource::collection($events), 'Published events retrieved');
    }

    public function show(string $identifier): JsonResponse
    {
        $event = Event::with(['category', 'creator', 'updater'])
            ->where(function ($q) use ($identifier) {
                $q->where('slug', $identifier)
                  ->orWhere('uuid', $identifier)
                  ->orWhere('id', $identifier);
            })
            ->firstOrFail();

        if ($event->status !== 'published') {
            $this->authorize('view', $event);
        }

        return $this->success(new EventResource($event), 'Event retrieved');
    }

    public function related(string $identifier): JsonResponse
    {
        $event = Event::where('slug', $identifier)
            ->orWhere('uuid', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();

        $related = $this->eventService->getRelatedEvents($event, 5);

        return $this->success(EventResource::collection($related), 'Related events retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', Event::class);

        $events = $this->eventService->getAdminEvents([
            'search'      => $request->input('search'),
            'category_id' => $request->input('category_id'),
            'status'      => $request->input('status'),
            'featured'    => $request->input('featured'),
            'sort_by'     => $request->input('sort_by'),
            'sort_dir'    => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(EventResource::collection($events), 'Admin events retrieved');
    }

    public function store(CreateEventRequest $request): JsonResponse
    {
        $this->authorize('create', Event::class);

        try {
            $event = $this->eventService->createEvent($request->validated(), $request->user());
            return $this->created(new EventResource($event), 'Event created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create event: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateEventRequest $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $this->authorize('update', $event);

        try {
            $updated = $this->eventService->updateEvent($event, $request->validated(), $request->user());
            return $this->success(new EventResource($updated), 'Event updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update event: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $this->authorize('delete', $event);

        try {
            $this->eventService->deleteEvent($event, $request->user());
            return $this->noContent('Event deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete event: ' . $e->getMessage(), 500);
        }
    }

    public function togglePublish(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $this->authorize('update', $event);

        $updated = $this->eventService->togglePublish($event, $request->user());
        return $this->success(new EventResource($updated), "Event status changed to {$updated->status}");
    }

    public function toggleFeatured(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $this->authorize('update', $event);

        $updated = $this->eventService->toggleFeatured($event, $request->user());
        return $this->success(new EventResource($updated), $updated->featured ? 'Event featured' : 'Event unfeatured');
    }

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $this->authorize('create', Event::class);

        $duplicate = $this->eventService->duplicateEvent($event, $request->user());
        return $this->created(new EventResource($duplicate), 'Event duplicated successfully');
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $this->authorize('update', $event);

        try {
            $updated = $this->eventService->cancelEvent($event, $request->user());
            return $this->success(new EventResource($updated), 'Event cancelled successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to cancel event: ' . $e->getMessage(), 500);
        }
    }
}
