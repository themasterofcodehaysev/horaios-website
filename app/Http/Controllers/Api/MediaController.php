<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Media\UploadMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Services\FileSecurityService;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MediaController extends BaseApiController
{
    public function __construct(
        protected MediaService $mediaService,
        protected FileSecurityService $fileSecurityService
    ) {
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

            // Additional security validation
            $errors = $this->fileSecurityService->validateFile($file);
            if (!empty($errors)) {
                return $this->error('File validation failed: ' . implode(', ', $errors), 422);
            }

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

        // Generate fresh signed URL for private files
        if ($media->disk === 'public') {
            $media->url = $this->mediaService->getSignedUrl($media);
        }

        return $this->success(new MediaResource($media), 'Media retrieved');
    }

    /**
     * GET /api/media/{uuid}/signed-url
     * Get a fresh signed URL for a media file.
     */
    public function getSignedUrl(Request $request, string $uuid): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $media = Media::where('uuid', $uuid)->firstOrFail();

        $expiration = $request->input('expires', 24); // hours
        $url = $this->mediaService->getSignedUrl($media, now()->addHours((int) $expiration));

        return $this->success(['url' => $url, 'expires_at' => now()->addHours((int) $expiration)->toIso8601String()], 'Signed URL generated');
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

    /**
     * PUT /api/media/{uuid}
     * Update media metadata.
     */
    public function update(Request $request, string $uuid): JsonResponse
    {
        $media = Media::where('uuid', $uuid)->firstOrFail();

        $this->authorize('update', $media);

        $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
        ]);

        try {
            $updated = $this->mediaService->update($media, $request->only(['alt_text', 'caption']), $request->user());

            return $this->success(new MediaResource($updated->load('uploader')), 'Media updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update media: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/media/stats
     * Get media library statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $stats = $this->mediaService->getStats();

        return $this->success($stats, 'Media statistics retrieved');
    }
}
