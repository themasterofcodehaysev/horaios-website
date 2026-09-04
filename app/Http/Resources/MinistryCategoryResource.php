<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MinistryCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'uuid'                    => $this->uuid,
            'name'                    => $this->name,
            'description'             => $this->description,
            'display_order'           => $this->display_order,
            'status'                  => $this->status,
            'published_ministries_count' => $this->whenCounted('publishedMinistries'),
            'ministries_count'        => $this->whenCounted('ministries'),
            'created_at'              => $this->created_at?->toISOString(),
            'updated_at'              => $this->updated_at?->toISOString(),
        ];
    }
}
