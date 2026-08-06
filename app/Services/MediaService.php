<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
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
        $path = $file->storeAs('uploads/' . date('Y/m'), $filename, $disk);
        $url = Storage::disk($disk)->url($path);

        $dimensions = null;
        if (str_contains($file->getMimeType(), 'image')) {
            $imageInfo = @getimagesize($file->getRealPath());
            if ($imageInfo) {
                $dimensions = ['width' => $imageInfo[0], 'height' => $imageInfo[1]];
            }
        }

        $media = Media::create([
            'uuid'              => $uuid,
            'filename'          => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type'         => $file->getMimeType(),
            'extension'         => $extension,
            'size'              => $file->getSize(),
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
            'size'     => $file->getSize(),
        ]);

        return $media;
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
}
