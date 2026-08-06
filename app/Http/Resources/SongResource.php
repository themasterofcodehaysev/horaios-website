<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SongResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'uuid'          => $this->uuid,
            'title'         => $this->title,
            'slug'          => $this->slug,
            'artist'        => $this->artist,
            'composer'      => $this->composer,
            'category_id'   => $this->category_id,
            'category'      => new SongCategoryResource($this->whenLoaded('category')),
            'lyrics'        => $this->lyrics,
            'featured'      => (bool) $this->featured,
            'status'        => $this->status,
            'display_order' => $this->display_order,
            'created_by'    => new UserResource($this->whenLoaded('creator')),
            'updated_by'    => new UserResource($this->whenLoaded('updater')),
            'created_at'    => $this->created_at?->toIso8601String(),
            'updated_at'    => $this->updated_at?->toIso8601String(),
        ];
    }
}
