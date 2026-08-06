<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'filename' => $this->filename,
            'original_filename' => $this->original_filename,
            'mime_type' => $this->mime_type,
            'extension' => $this->extension,
            'size' => $this->size,
            'size_formatted' => $this->size_formatted,
            'width' => $this->width,
            'height' => $this->height,
            'disk' => $this->disk,
            'path' => $this->path,
            'url' => $this->url,
            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'uploaded_by' => $this->whenLoaded('uploader', fn() => [
                'id' => $this->uploader->id,
                'display_name' => $this->uploader->display_name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
