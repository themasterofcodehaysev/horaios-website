<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\LeaderResource;
use App\Models\Leader;
use App\Services\LeaderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class LeaderController extends BaseApiController
{
    public function __construct(protected LeaderService $leaderService)
    {
    }

    public function index(): JsonResponse
    {
        $leaders = $this->leaderService->getPublicLeaders();
        return $this->success(LeaderResource::collection($leaders), 'Leadership team retrieved successfully');
    }

    public function adminIndex(): JsonResponse
    {
        $this->authorize('create', Leader::class);
        $leaders = $this->leaderService->getAdminLeaders();
        return $this->success(LeaderResource::collection($leaders), 'Admin leadership team retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Leader::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'role'          => 'required|string|max:255',
            'bio'           => 'nullable|string',
            'photo'         => 'nullable|string|max:500',
            'email'         => 'nullable|email|max:255',
            'phone'         => 'nullable|string|max:50',
            'facebook'      => 'nullable|url|max:255',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $leader = $this->leaderService->createLeader($validated, $request->user());
            return $this->created(new LeaderResource($leader), 'Leader created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create leader: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $leader = Leader::findOrFail($id);
        return $this->success(new LeaderResource($leader), 'Leader details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $leader = Leader::findOrFail($id);
        $this->authorize('update', $leader);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'role'          => 'sometimes|required|string|max:255',
            'bio'           => 'nullable|string',
            'photo'         => 'nullable|string|max:500',
            'email'         => 'nullable|email|max:255',
            'phone'         => 'nullable|string|max:50',
            'facebook'      => 'nullable|url|max:255',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $updated = $this->leaderService->updateLeader($leader, $validated, $request->user());
            return $this->success(new LeaderResource($updated), 'Leader updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update leader: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $leader = Leader::findOrFail($id);
        $this->authorize('delete', $leader);

        try {
            $this->leaderService->deleteLeader($leader, $request->user());
            return $this->noContent('Leader deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete leader: ' . $e->getMessage(), 500);
        }
    }

    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $leader = Leader::findOrFail($id);
        $this->authorize('update', $leader);

        try {
            $updated = $this->leaderService->toggleStatus($leader, $request->user());
            return $this->success(new LeaderResource($updated), 'Leader status updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update leader status: ' . $e->getMessage(), 500);
        }
    }

    public function reorder(Request $request): JsonResponse
    {
        $this->authorize('create', Leader::class);

        $validated = $request->validate([
            'orders'                 => 'required|array',
            'orders.*.id'            => 'required|integer|exists:leaders,id',
            'orders.*.display_order' => 'required|integer|min:0',
        ]);

        try {
            $this->leaderService->reorderLeaders($validated['orders'], $request->user());
            return $this->success(null, 'Leaders reordered successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to reorder leaders: ' . $e->getMessage(), 500);
        }
    }
}
