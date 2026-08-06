<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MinistryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'uuid'            => $this->uuid,
            'name'            => $this->name,
            'slug'            => $this->slug,
            'description'     => $this->description,
            'leader'          => $this->leader,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'featured_image'  => $this->featured_image,
            'category_id'     => $this->category_id,
            'category'        => new MinistryCategoryResource($this->whenLoaded('category')),
            'meeting_day'     => $this->meeting_day,
            'meeting_time'    => $this->meeting_time,
            'location'        => $this->location,
            'featured'        => (bool) $this->featured,
            'status'          => $this->status,
            'display_order'   => $this->display_order,
            'published_at'    => $this->published_at?->toISOString(),
            'seo_title'       => $this->seo_title,
            'seo_description' => $this->seo_description,
            'seo_image'       => $this->seo_image,
            'canonical_url'   => $this->canonical_url,
            'created_by'      => $this->whenLoaded('creator', fn() => [
                'id'           => $this->creator->id,
                'display_name' => $this->creator->display_name,
                'email'        => $this->creator->email,
            ]),
            'updated_by'      => $this->whenLoaded('updater', fn() => [
                'id'           => $this->updater->id,
                'display_name' => $this->updater->display_name,
                'email'        => $this->updater->email,
            ]),
            'created_at'      => $this->created_at?->toISOString(),
            'updated_at'      => $this->updated_at?->toISOString(),
        ];
    }
}
