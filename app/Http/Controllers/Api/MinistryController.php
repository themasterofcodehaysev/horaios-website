<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Ministry\CreateMinistryRequest;
use App\Http\Requests\Ministry\UpdateMinistryRequest;
use App\Http\Resources\MinistryResource;
use App\Models\Ministry;
use App\Services\MinistryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MinistryController extends BaseApiController
{
    public function __construct(protected MinistryService $ministryService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $ministries = $this->ministryService->getPublicMinistries([
            'search'        => $request->input('search'),
            'category_id'   => $request->input('category_id'),
            'category_slug' => $request->input('category_slug'),
            'featured'      => $request->input('featured'),
        ], $request->input('per_page', 12));

        return $this->paginated(MinistryResource::collection($ministries), 'Published ministries retrieved');
    }

    public function show(string $identifier): JsonResponse
    {
        $ministry = Ministry::with(['category', 'creator', 'updater'])
            ->where(function ($q) use ($identifier) {
                $q->where('slug', $identifier)
                  ->orWhere('uuid', $identifier)
                  ->orWhere('id', $identifier);
            })
            ->firstOrFail();

        if ($ministry->status !== 'published') {
            $this->authorize('view', $ministry);
        }

        return $this->success(new MinistryResource($ministry), 'Ministry retrieved');
    }

    public function related(string $identifier): JsonResponse
    {
        $ministry = Ministry::with('category')
            ->where('slug', $identifier)
            ->orWhere('uuid', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();

        $related = $this->ministryService->getRelatedMinistries($ministry, 5);

        return $this->success(MinistryResource::collection($related), 'Related ministries retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', Ministry::class);

        $ministries = $this->ministryService->getAdminMinistries([
            'search'      => $request->input('search'),
            'category_id' => $request->input('category_id'),
            'status'      => $request->input('status'),
            'featured'    => $request->input('featured'),
            'sort_by'     => $request->input('sort_by'),
            'sort_dir'    => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(MinistryResource::collection($ministries), 'Admin ministries retrieved');
    }

    public function store(CreateMinistryRequest $request): JsonResponse
    {
        $this->authorize('create', Ministry::class);

        try {
            $ministry = $this->ministryService->createMinistry($request->validated(), $request->user());
            return $this->created(new MinistryResource($ministry), 'Ministry created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create ministry: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateMinistryRequest $request, int $id): JsonResponse
    {
        $ministry = Ministry::findOrFail($id);
        $this->authorize('update', $ministry);

        try {
            $updated = $this->ministryService->updateMinistry($ministry, $request->validated(), $request->user());
            return $this->success(new MinistryResource($updated), 'Ministry updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update ministry: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $ministry = Ministry::findOrFail($id);
        $this->authorize('delete', $ministry);

        try {
            $this->ministryService->deleteMinistry($ministry, $request->user());
            return $this->noContent('Ministry deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete ministry: ' . $e->getMessage(), 500);
        }
    }

    public function togglePublish(Request $request, int $id): JsonResponse
    {
        $ministry = Ministry::findOrFail($id);
        $this->authorize('update', $ministry);

        $updated = $this->ministryService->togglePublish($ministry, $request->user());
        return $this->success(new MinistryResource($updated), "Ministry status changed to {$updated->status}");
    }

    public function toggleFeatured(Request $request, int $id): JsonResponse
    {
        $ministry = Ministry::findOrFail($id);
        $this->authorize('update', $ministry);

        $updated = $this->ministryService->toggleFeatured($ministry, $request->user());
        return $this->success(new MinistryResource($updated), $updated->featured ? 'Ministry featured' : 'Ministry unfeatured');
    }

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $ministry = Ministry::findOrFail($id);
        $this->authorize('create', Ministry::class);

        $duplicate = $this->ministryService->duplicateMinistry($ministry, $request->user());
        return $this->created(new MinistryResource($duplicate), 'Ministry duplicated successfully');
    }

    public function reorder(Request $request, int $id): JsonResponse
    {
        $ministry = Ministry::findOrFail($id);
        $this->authorize('update', $ministry);

        $validated = $request->validate([
            'display_order' => 'required|integer|min:0',
        ]);

        try {
            $updated = $this->ministryService->reorderMinistry($ministry, $validated['display_order'], $request->user());
            return $this->success(new MinistryResource($updated), 'Ministry order updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to reorder ministry: ' . $e->getMessage(), 500);
        }
    }
}
