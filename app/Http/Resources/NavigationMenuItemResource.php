<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationMenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'menu_id' => $this->menu_id,
            'parent_id' => $this->parent_id,
            'label' => $this->label,
            'url' => $this->url,
            'is_external' => $this->is_external,
            'open_in_new_tab' => $this->open_in_new_tab,
            'is_active' => $this->is_active,
            'display_order' => $this->display_order,
            'icon' => $this->icon,
            'children' => NavigationMenuItemResource::collection($this->whenLoaded('children')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
