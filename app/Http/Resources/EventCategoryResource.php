<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'uuid'                 => $this->uuid,
            'name'                 => $this->name,
            'description'          => $this->description,
            'display_order'        => $this->display_order,
            'status'               => $this->status,
            'published_events_count' => $this->whenCounted('publishedEvents'),
            'events_count'         => $this->whenCounted('events'),
            'created_at'           => $this->created_at?->toISOString(),
            'updated_at'           => $this->updated_at?->toISOString(),
        ];
    }
}
