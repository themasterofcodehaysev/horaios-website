<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SongCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'uuid'          => $this->uuid,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'display_order' => $this->display_order,
            'status'        => $this->status,
            'songs_count'   => $this->whenCounted('songs', $this->songs_count, fn() => $this->published_songs_count ?? null),
            'created_at'    => $this->created_at?->toIso8601String(),
            'updated_at'    => $this->updated_at?->toIso8601String(),
        ];
    }
}
