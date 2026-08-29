<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrayerRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->is_anonymous ? 'Anonymous' : $this->name,
            'email' => $this->when(!$this->is_anonymous && $this->email, $this->email),
            'phone' => $this->when(!$this->is_anonymous && $this->phone, $this->phone),
            'title' => $this->title,
            'request' => $this->request,
            'request_type' => $this->request_type,
            'urgency' => $this->urgency,
            'allow_public_prayer' => $this->allow_public_prayer,
            'is_anonymous' => $this->is_anonymous,
            'status' => $this->status,
            'admin_notes' => $this->when(auth()->check() && auth()->user()->can('viewAny', PrayerRequest::class), $this->admin_notes),
            'processed_by' => $this->whenLoaded('processor', fn() => [
                'id' => $this->processor?->id,
                'display_name' => $this->processor?->display_name,
            ]),
            'processed_at' => $this->processed_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
