<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'key' => $this->key,
            'title' => $this->title,
            'content' => $this->content,
            'data' => $this->data,
            'is_visible' => $this->is_visible,
            'display_order' => $this->display_order,
            'background_image' => $this->background_image,
            'background_color' => $this->background_color,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
