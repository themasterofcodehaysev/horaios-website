<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ChurchServiceResource;
use App\Models\ChurchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ChurchServiceController extends BaseApiController
{
    /**
     * Public listing: only active church services ordered by display_order.
     */
    public function index(): JsonResponse
    {
        $services = ChurchService::active()->ordered()->get();
        return $this->success(
            ChurchServiceResource::collection($services),
            'Church services retrieved successfully'
        );
    }

    /**
     * Admin listing: all church services.
     */
    public function adminIndex(): JsonResponse
    {
        $this->authorize('viewAny', ChurchService::class);

        $services = ChurchService::ordered()->get();
        return $this->success(
            ChurchServiceResource::collection($services),
            'Admin church services retrieved'
        );
    }

    /**
     * Store a new church service.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', ChurchService::class);

        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'day'           => 'required|string|max:100',
            'time'          => 'required|string|max:150',
            'type'          => 'nullable|string|max:150',
            'location'      => 'nullable|string|max:255',
            'description'   => 'nullable|string',
            'icon'          => 'nullable|string', // allows HTML code, e.g. <i class="fa-solid fa-church"></i>
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            if (!isset($validated['display_order'])) {
                $maxOrder = ChurchService::max('display_order') ?? 0;
                $validated['display_order'] = $maxOrder + 1;
            }

            $service = ChurchService::create($validated);
            return $this->created(new ChurchServiceResource($service), 'Church service created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create church service: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified church service.
     */
    public function show(int $id): JsonResponse
    {
        $service = ChurchService::findOrFail($id);
        $this->authorize('view', $service);

        return $this->success(new ChurchServiceResource($service), 'Church service details retrieved');
    }

    /**
     * Update the specified church service.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $service = ChurchService::findOrFail($id);
        $this->authorize('update', $service);

        $validated = $request->validate([
            'title'         => 'sometimes|required|string|max:255',
            'day'           => 'sometimes|required|string|max:100',
            'time'          => 'sometimes|required|string|max:150',
            'type'          => 'nullable|string|max:150',
            'location'      => 'nullable|string|max:255',
            'description'   => 'nullable|string',
            'icon'          => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $service->update($validated);
            return $this->success(new ChurchServiceResource($service), 'Church service updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update church service: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified church service.
     */
    public function destroy(int $id): JsonResponse
    {
        $service = ChurchService::findOrFail($id);
        $this->authorize('delete', $service);

        try {
            $service->delete();
            return $this->noContent('Church service deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete church service: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Toggle status between active and inactive.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $service = ChurchService::findOrFail($id);
        $this->authorize('update', $service);

        $newStatus = $service->status === 'active' ? 'inactive' : 'active';
        $service->update(['status' => $newStatus]);

        return $this->success(
            new ChurchServiceResource($service),
            "Service status changed to {$newStatus}"
        );
    }

    /**
     * Reorder multiple church services.
     */
    public function reorder(Request $request): JsonResponse
    {
        $this->authorize('update', ChurchService::class);
        $validated = $request->validate([
            'orders'      => 'required|array',
            'orders.*.id' => 'required|integer|exists:church_services,id',
            'orders.*.display_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['orders'] as $item) {
            ChurchService::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
        }

        $services = ChurchService::ordered()->get();
        return $this->success(
            ChurchServiceResource::collection($services),
            'Services reordered successfully'
        );
    }
}
