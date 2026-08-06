<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Media\UploadMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MediaController extends BaseApiController
{
    public function __construct(protected MediaService $mediaService)
    {
    }

    /**
     * GET /api/media
     * List all media files with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $query = Media::with('uploader')
            ->when($request->search, fn($q) => $q->where('original_filename', 'like', "%{$request->search}%"))
            ->when($request->mime_type, fn($q) => $q->where('mime_type', 'like', "{$request->mime_type}%"))
            ->when($request->uploaded_by, fn($q) => $q->where('uploaded_by', $request->uploaded_by))
            ->orderBy('created_at', 'desc');

        $media = $query->paginate($request->per_page ?? 20);

        return $this->paginated(MediaResource::collection($media), 'Media files retrieved');
    }

    /**
     * POST /api/media
     * Upload a new media file.
     */
    public function store(UploadMediaRequest $request): JsonResponse
    {
        $this->authorize('create', Media::class);

        try {
            $file = $request->file('file');
            $disk = $request->input('disk', 'public');

            $media = $this->mediaService->upload($file, $request->user()->id, $disk, [
                'alt_text' => $request->input('alt_text'),
                'caption' => $request->input('caption'),
            ]);

            return $this->created(new MediaResource($media->load('uploader')), 'File uploaded successfully');
        } catch (Throwable $e) {
            return $this->error('Upload failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/media/{uuid}
     * Get a single media item.
     */
    public function show(string $uuid): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $media = Media::with('uploader')->where('uuid', $uuid)->firstOrFail();

        return $this->success(new MediaResource($media), 'Media retrieved');
    }

    /**
     * DELETE /api/media/{uuid}
     * Delete a media file from disk and database.
     */
    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $media = Media::where('uuid', $uuid)->firstOrFail();

        $this->authorize('delete', $media);

        try {
            $this->mediaService->delete($media, $request->user());

            return $this->noContent('Media deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete media: ' . $e->getMessage(), 500);
        }
    }
}
