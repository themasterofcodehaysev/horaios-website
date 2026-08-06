<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SermonSeriesResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'uuid'          => $this->uuid,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'thumbnail'     => $this->thumbnail,
            'display_order' => $this->display_order,
            'status'        => $this->status,
            'sermons_count' => $this->whenCounted('sermons'),
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
        ];
    }
}
