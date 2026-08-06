<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChurchSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'value' => $this->value,
            'type' => $this->type,
            'group' => $this->group,
            'label' => $this->label,
            'description' => $this->description,
            'is_public' => $this->is_public,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
