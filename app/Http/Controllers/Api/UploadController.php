<?php

namespace App\Http\Controllers\Api;

use App\Services\FileSecurityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends BaseApiController
{
    public function __construct(
        protected FileSecurityService $fileSecurityService
    ) {}

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:10240'],
            'folder' => ['nullable', 'string', 'regex:/^[a-zA-Z0-9_-]+$/'],
        ]);

        $file = $request->file('image');
        $folder = $request->input('folder', 'general');
        $subDirectory = 'uploads/' . $folder . '/' . date('Y/m');

        try {
            $path = $this->fileSecurityService->storeFile($file, $subDirectory);
            $url = '/storage/' . ltrim($path, '/');

            return $this->created([
                'url' => $url,
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ], 'Image uploaded successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (\Exception $e) {
            return $this->error('Failed to upload image: ' . $e->getMessage(), 500);
        }
    }
}
