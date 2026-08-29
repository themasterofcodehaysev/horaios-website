<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'admin_notes' => $this->when(auth()->check() && auth()->user()->can('viewAny', ContactMessage::class), $this->admin_notes),
            'replied_by' => $this->whenLoaded('replier', fn() => [
                'id' => $this->replier?->id,
                'display_name' => $this->replier?->display_name,
            ]),
            'replied_at' => $this->replied_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
