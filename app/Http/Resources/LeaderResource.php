<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderResource extends JsonResource
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
            'name'          => $this->name,
            'role'          => $this->role,
            'bio'           => $this->bio,
            'photo'         => $this->photo,
            'email'         => $this->email,
            'phone'         => $this->phone,
            'facebook'      => $this->facebook,
            'display_order' => $this->display_order,
            'status'        => $this->status,
            'created_at'    => $this->created_at?->toIso8601String(),
            'updated_at'    => $this->updated_at?->toIso8601String(),
        ];
    }
}
