<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Song\CreateSongRequest;
use App\Http\Requests\Song\UpdateSongRequest;
use App\Http\Resources\SongResource;
use App\Models\Song;
use App\Services\SongService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SongController extends BaseApiController
{
    public function __construct(protected SongService $songService)
    {
    }

    /**
     * GET /api/v1/songs
     * Public catalog of published songs.
     */
    public function index(Request $request): JsonResponse
    {
        $songs = $this->songService->getPublicSongs([
            'search'        => $request->input('search'),
            'category_id'   => $request->input('category_id'),
            'featured'      => $request->input('featured'),
        ], $request->input('per_page', 12));

        return $this->paginated(SongResource::collection($songs), 'Published songs retrieved');
    }

    /**
     * GET /api/v1/songs/{id}
     * Public detail of a published song (or by UUID).
     */
    public function show(string $identifier): JsonResponse
    {
        $song = Song::with('category')
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)
                  ->orWhere('uuid', $identifier);
            })
            ->firstOrFail();

        // If not published, enforce authorization
        if ($song->status !== 'published') {
            $this->authorize('view', $song);
        }

        return $this->success(new SongResource($song), 'Song retrieved');
    }

    /**
     * GET /api/v1/songs/{id}/related
     * Public list of up to 5 related songs in the same category.
     */
    public function related(string $identifier): JsonResponse
    {
        $song = Song::where('id', $identifier)
            ->orWhere('uuid', $identifier)
            ->firstOrFail();

        $related = Song::with('category')
            ->where('status', 'published')
            ->where('id', '!=', $song->id)
            ->when($song->category_id, fn($q) => $q->where('category_id', $song->category_id))
            ->orderBy('featured', 'desc')
            ->orderBy('display_order', 'asc')
            ->limit(5)
            ->get();

        return $this->success(SongResource::collection($related), 'Related songs retrieved');
    }

    /**
     * GET /api/v1/admin/songs
     * Admin list of songs (draft + published, full filters).
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', Song::class);

        $songs = $this->songService->getAdminSongs([
            'search'      => $request->input('search'),
            'category_id' => $request->input('category_id'),
            'status'      => $request->input('status'),
            'featured'    => $request->input('featured'),
            'sort_by'     => $request->input('sort_by'),
            'sort_dir'    => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(SongResource::collection($songs), 'Admin songs retrieved');
    }

    /**
     * GET /api/v1/admin/songs/{id}
     * Admin detail for a single song, including drafts.
     */
    public function adminShow(int $id): JsonResponse
    {
        $song = Song::with(['category', 'creator', 'updater'])->findOrFail($id);
        $this->authorize('update', $song);

        return $this->success(new SongResource($song), 'Admin song retrieved');
    }

    /**
     * POST /api/v1/admin/songs
     * Create a new song.
     */
    public function store(CreateSongRequest $request): JsonResponse
    {
        $this->authorize('create', Song::class);

        try {
            $song = $this->songService->createSong($request->validated(), $request->user());

            return $this->created(new SongResource($song), 'Song created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create song: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/v1/admin/songs/{id}
     * Update an existing song.
     */
    public function update(UpdateSongRequest $request, int $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $this->authorize('update', $song);

        try {
            $updated = $this->songService->updateSong($song, $request->validated(), $request->user());

            return $this->success(new SongResource($updated), 'Song updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update song: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/v1/admin/songs/{id}
     * Delete a song.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $this->authorize('delete', $song);

        try {
            $this->songService->deleteSong($song, $request->user());

            return $this->noContent('Song deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete song: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PATCH /api/v1/admin/songs/{id}/toggle-publish
     */
    public function togglePublish(Request $request, int $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $this->authorize('update', $song);

        $updated = $this->songService->togglePublish($song, $request->user());

        return $this->success(new SongResource($updated), "Song status changed to {$updated->status}");
    }

    /**
     * PATCH /api/v1/admin/songs/{id}/toggle-featured
     */
    public function toggleFeatured(Request $request, int $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $this->authorize('update', $song);

        $updated = $this->songService->toggleFeatured($song, $request->user());

        return $this->success(new SongResource($updated), $updated->featured ? 'Song featured' : 'Song unfeatured');
    }

    /**
     * POST /api/v1/admin/songs/{id}/duplicate
     */
    public function duplicate(Request $request, int $id): JsonResponse
    {
        $song = Song::findOrFail($id);
        $this->authorize('create', Song::class);

        $duplicate = $this->songService->duplicateSong($song, $request->user());

        return $this->created(new SongResource($duplicate), 'Song duplicated successfully');
    }
}
