<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpeakerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'uuid'          => $this->uuid,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'photo'         => $this->photo,
            'biography'     => $this->biography,
            'position'      => $this->position,
            'email'         => $this->email,
            'facebook'      => $this->facebook,
            'status'        => $this->status,
            'display_order' => $this->display_order,
            'sermons_count' => $this->whenCounted('sermons'),
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
        ];
    }
}
