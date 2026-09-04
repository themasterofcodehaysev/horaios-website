<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Sermon\CreateSermonRequest;
use App\Http\Requests\Sermon\UpdateSermonRequest;
use App\Http\Resources\SermonResource;
use App\Models\Sermon;
use App\Services\SermonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SermonController extends BaseApiController
{
    public function __construct(protected SermonService $sermonService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $sermons = $this->sermonService->getPublicSermons([
            'search'        => $request->input('search'),
            'speaker_id'    => $request->input('speaker_id'),
            'series_id'     => $request->input('series_id'),
            'category_id'   => $request->input('category_id'),
            'featured'      => $request->input('featured'),
        ], $request->input('per_page', 12));

        return $this->paginated(SermonResource::collection($sermons), 'Published sermons retrieved');
    }

    public function show(Request $request, string $identifier): JsonResponse
    {
        $sermon = Sermon::with(['speaker', 'series', 'category'])
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)
                  ->orWhere('uuid', $identifier);
            })
            ->firstOrFail();

        if ($sermon->status !== 'published') {
            $user = $request->user() ?: auth('sanctum')->user();
            if (! $user || ! $user->can('view', $sermon)) {
                throw new \Illuminate\Auth\Access\AuthorizationException();
            }
        }

        return $this->success(new SermonResource($sermon), 'Sermon retrieved');
    }

    public function adminShow(int $id): JsonResponse
    {
        $sermon = Sermon::with(['speaker', 'series', 'category'])->findOrFail($id);
        $this->authorize('update', $sermon);

        return $this->success(new SermonResource($sermon), 'Admin sermon retrieved');
    }

    public function related(string $identifier): JsonResponse
    {
        $sermon = Sermon::with(['speaker', 'series', 'category'])
            ->where('id', $identifier)
            ->orWhere('uuid', $identifier)
            ->firstOrFail();

        $related = $this->sermonService->getRelatedSermons($sermon, 5);

        return $this->success(SermonResource::collection($related), 'Related sermons retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', Sermon::class);

        $sermons = $this->sermonService->getAdminSermons([
            'search'      => $request->input('search'),
            'speaker_id'  => $request->input('speaker_id'),
            'series_id'   => $request->input('series_id'),
            'category_id' => $request->input('category_id'),
            'status'      => $request->input('status'),
            'featured'    => $request->input('featured'),
            'sort_by'     => $request->input('sort_by'),
            'sort_dir'    => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(SermonResource::collection($sermons), 'Admin sermons retrieved');
    }

    public function store(CreateSermonRequest $request): JsonResponse
    {
        $this->authorize('create', Sermon::class);

        try {
            $sermon = $this->sermonService->createSermon($request->validated(), $request->user());
            return $this->created(new SermonResource($sermon), 'Sermon created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create sermon: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateSermonRequest $request, int $id): JsonResponse
    {
        $sermon = Sermon::findOrFail($id);
        $this->authorize('update', $sermon);

        try {
            $updated = $this->sermonService->updateSermon($sermon, $request->validated(), $request->user());
            return $this->success(new SermonResource($updated), 'Sermon updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update sermon: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $sermon = Sermon::findOrFail($id);
        $this->authorize('delete', $sermon);

        try {
            $this->sermonService->deleteSermon($sermon, $request->user());
            return $this->noContent('Sermon deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete sermon: ' . $e->getMessage(), 500);
        }
    }

    public function togglePublish(Request $request, int $id): JsonResponse
    {
        $sermon = Sermon::findOrFail($id);
        $this->authorize('update', $sermon);

        $updated = $this->sermonService->togglePublish($sermon, $request->user());
        return $this->success(new SermonResource($updated), "Sermon status changed to {$updated->status}");
    }

    public function toggleFeatured(Request $request, int $id): JsonResponse
    {
        $sermon = Sermon::findOrFail($id);
        $this->authorize('update', $sermon);

        $updated = $this->sermonService->toggleFeatured($sermon, $request->user());
        return $this->success(new SermonResource($updated), $updated->featured ? 'Sermon featured' : 'Sermon unfeatured');
    }

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $sermon = Sermon::findOrFail($id);
        $this->authorize('create', Sermon::class);

        $duplicate = $this->sermonService->duplicateSermon($sermon, $request->user());
        return $this->created(new SermonResource($duplicate), 'Sermon duplicated successfully');
    }
}
