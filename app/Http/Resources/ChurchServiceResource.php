<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChurchServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'day'           => $this->day,
            'time'          => $this->time,
            'type'          => $this->type,
            'location'      => $this->location,
            'description'   => $this->description,
            'icon'          => $this->icon,
            'display_order' => $this->display_order,
            'status'        => $this->status,
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
        ];
    }
}
