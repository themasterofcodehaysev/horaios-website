<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

class MediaService
{
    protected ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = ImageManager::gd();
    }

    /**
     * Upload a file and create a Media record.
     */
    public function upload(UploadedFile $file, ?int $userId = null, string $disk = 'public', array $meta = []): Media
    {
        return $this->storeMedia($file, $userId, $disk, $meta);
    }

    /**
     * Store a file and return the Media model.
     */
    public function storeMedia(UploadedFile $file, ?int $userId = null, string $disk = 'public', array $meta = []): Media
    {
        $uuid = (string) Str::uuid();
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = $uuid . '.' . $extension;
        
        // Process image files for optimization and EXIF stripping
        $processedFile = $this->processImage($file);
        
        $path = $processedFile->storeAs('uploads/' . date('Y/m'), $filename, $disk);
        
        // Use signed URL for private storage
        $url = Storage::disk($disk)->visibility($disk === 'public' ? 'public' : 'private')
            ? Storage::disk($disk)->url($path)
            : Storage::disk($disk)->temporaryUrl($path, now()->addHours(24));

        $dimensions = null;
        if (str_contains($processedFile->getMimeType(), 'image')) {
            $imageInfo = @getimagesize($processedFile->getRealPath());
            if ($imageInfo) {
                $dimensions = ['width' => $imageInfo[0], 'height' => $imageInfo[1]];
            }
        }

        $media = Media::create([
            'uuid'              => $uuid,
            'filename'          => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type'         => $processedFile->getMimeType(),
            'extension'         => $extension,
            'size'              => $processedFile->getSize(),
            'width'             => $dimensions['width'] ?? null,
            'height'            => $dimensions['height'] ?? null,
            'disk'              => $disk,
            'path'              => $path,
            'url'               => $url,
            'uploaded_by'       => $userId,
            'alt_text'          => $meta['alt_text'] ?? null,
            'caption'           => $meta['caption'] ?? null,
        ]);

        AuditLogService::log('create', 'Media', (string) $media->id, null, [
            'filename' => $filename,
            'size'     => $processedFile->getSize(),
        ]);

        return $media;
    }

    /**
     * Process image file for optimization and EXIF stripping.
     */
    protected function processImage(UploadedFile $file): UploadedFile
    {
        if (!str_contains($file->getMimeType(), 'image')) {
            return $file;
        }

        try {
            $image = $this->imageManager->read($file->getRealPath());
            
            // Strip EXIF data (including location/metadata)
            $image->getCore()->strip();
            
            // Optimize image: resize to max 1920x1080 if larger, quality 80%
            $maxWidth = 1920;
            $maxHeight = 1080;
            
            if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
                $image->resize($maxWidth, $maxHeight, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }
            
            // Convert to JPG with 80% quality
            $optimizedPath = tempnam(sys_get_temp_dir(), 'optimized_');
            $image->encode('jpg', 80)->save($optimizedPath);
            
            // Create new UploadedFile from optimized image
            $optimizedFile = new UploadedFile(
                $optimizedPath,
                $file->getClientOriginalName(),
                'image/jpeg',
                filesize($optimizedPath),
                UPLOAD_ERR_OK,
                true
            );
            
            return $optimizedFile;
        } catch (\Exception $e) {
            // If image processing fails, return original file
            return $file;
        }
    }

    /**
     * Get a fresh signed URL for a media file.
     */
    public function getSignedUrl(Media $media, \DateTimeInterface $expiration = null): string
    {
        $expiration = $expiration ?? now()->addHours(24);
        
        if (Storage::disk($media->disk)->exists($media->path)) {
            return Storage::disk($media->disk)->temporaryUrl($media->path, $expiration);
        }
        
        return $media->url; // Fallback to stored URL
    }

    /**
     * Delete a media file from disk and database.
     */
    public function delete(Media $media, ?User $deletedBy = null): void
    {
        // Remove from storage disk
        if (Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        AuditLogService::log('delete', 'Media', (string) $media->id, [
            'filename' => $media->filename,
            'url'      => $media->url,
        ], null, $deletedBy?->id);

        $media->delete();
    }

    /**
     * Update media metadata (alt text, caption).
     */
    public function update(Media $media, array $data, ?User $updatedBy = null): Media
    {
        $oldValues = $media->only(['alt_text', 'caption']);
        $media->update($data);

        AuditLogService::log('update', 'Media', (string) $media->id, $oldValues, $media->only(['alt_text', 'caption']), $updatedBy?->id);

        return $media->fresh();
    }

    /**
     * Get media statistics.
     */
    public function getStats(): array
    {
        $allMedia = Media::query();

        return [
            'total' => $allMedia->count(),
            'images' => $allMedia->where('mime_type', 'like', 'image%')->count(),
            'documents' => $allMedia->where('mime_type', 'like', 'application%')->count(),
            'videos' => $allMedia->where('mime_type', 'like', 'video%')->count(),
            'audio' => $allMedia->where('mime_type', 'like', 'audio%')->count(),
            'total_size' => $allMedia->sum('size'),
        ];
    }

    /**
     * Get media by type category.
     */
    public function getMediaByType(string $type): \Illuminate\Database\Eloquent\Collection
    {
        return Media::where('mime_type', 'like', "{$type}%")
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Delete a media file from disk and database.
     */
    public function delete(Media $media, ?User $deletedBy = null): void
    {
        // Remove from storage disk
        if (Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        AuditLogService::log('delete', 'Media', (string) $media->id, [
            'filename' => $media->filename,
            'url'      => $media->url,
        ], null, $deletedBy?->id);

        $media->delete();
    }

    /**
     * Update media metadata (alt text, caption).
     */
    public function update(Media $media, array $data, ?User $updatedBy = null): Media
    {
        $oldValues = $media->only(['alt_text', 'caption']);
        $media->update($data);

        AuditLogService::log('update', 'Media', (string) $media->id, $oldValues, $media->only(['alt_text', 'caption']), $updatedBy?->id);

        return $media->fresh();
    }

    /**
     * Get media statistics.
     */
    public function getStats(): array
    {
        $allMedia = Media::query();

        return [
            'total' => $allMedia->count(),
            'images' => $allMedia->where('mime_type', 'like', 'image%')->count(),
            'documents' => $allMedia->where('mime_type', 'like', 'application%')->count(),
            'videos' => $allMedia->where('mime_type', 'like', 'video%')->count(),
            'audio' => $allMedia->where('mime_type', 'like', 'audio%')->count(),
            'total_size' => $allMedia->sum('size'),
        ];
    }

    /**
     * Get media by type category.
     */
    public function getMediaByType(string $type): \Illuminate\Database\Eloquent\Collection
    {
        return Media::where('mime_type', 'like', "{$type}%")
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
