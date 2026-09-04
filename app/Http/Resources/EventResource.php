<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'uuid'                  => $this->uuid,
            'title'                 => $this->title,
            'description'           => $this->description,
            'featured_image'        => $this->featured_image,
            'category_id'           => $this->category_id,
            'category'              => new EventCategoryResource($this->whenLoaded('category')),
            'location'              => $this->location,
            'google_map_url'        => $this->google_map_url,
            'start_date'            => $this->start_date?->toISOString(),
            'end_date'              => $this->end_date?->toISOString(),
            'start_time'            => $this->start_time,
            'end_time'              => $this->end_time,
            'registration_required' => (bool) $this->registration_required,
            'registration_limit'    => $this->registration_limit,
            'featured'              => (bool) $this->featured,
            'status'                => $this->status,
            'event_status'          => $this->event_status,
            'published_at'          => $this->published_at?->toISOString(),
            'created_by'            => $this->whenLoaded('creator', fn() => [
                'id'           => $this->creator->id,
                'display_name' => $this->creator->display_name,
                'email'        => $this->creator->email,
            ]),
            'updated_by'            => $this->whenLoaded('updater', fn() => [
                'id'           => $this->updater->id,
                'display_name' => $this->updater->display_name,
                'email'        => $this->updater->email,
            ]),
            'created_at'            => $this->created_at?->toISOString(),
            'updated_at'            => $this->updated_at?->toISOString(),
        ];
    }
}
