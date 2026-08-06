<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\EventCategoryResource;
use App\Models\EventCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class EventCategoryController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $categories = EventCategory::withCount('publishedEvents')
            ->where('status', 'active')
            ->when($request->has('sort_by'), function ($q) use ($request) {
                $q->orderBy($request->input('sort_by'), $request->input('sort_dir', 'asc'));
            })
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return $this->success(EventCategoryResource::collection($categories), 'Active event categories retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', EventCategory::class);

        $categories = EventCategory::withCount('publishedEvents')
            ->when($request->has('status'), fn($q) => $q->where('status', $request->input('status')))
            ->when($request->has('sort_by'), function ($q) use ($request) {
                $q->orderBy($request->input('sort_by'), $request->input('sort_dir', 'asc'));
            })
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return $this->success(EventCategoryResource::collection($categories), 'Admin event categories retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', EventCategory::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:event_categories,slug',
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category = EventCategory::create($validated);
            return $this->created(new EventCategoryResource($category), 'Event category created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create event category: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $category = EventCategory::withCount('publishedEvents')->findOrFail($id);
        return $this->success(new EventCategoryResource($category), 'Event category details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = EventCategory::findOrFail($id);
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:event_categories,slug,' . $id,
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category->update($validated);
            return $this->success(new EventCategoryResource($category->fresh()), 'Event category updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update event category: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = EventCategory::findOrFail($id);
        $this->authorize('delete', $category);

        try {
            $category->delete();
            return $this->noContent('Event category deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete event category: ' . $e->getMessage(), 500);
        }
    }
}
