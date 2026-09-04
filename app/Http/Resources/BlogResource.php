<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'uuid'           => $this->uuid,
            'title'          => $this->title,
            'excerpt'        => $this->excerpt,
            'content'        => $this->content,
            'featured_image' => $this->featured_image,
            'featured'       => (bool) $this->featured,
            'status'         => $this->status,
            'published_at'   => $this->published_at?->toISOString(),
            'category_id'    => $this->category_id,
            'category'       => new BlogCategoryResource($this->whenLoaded('category')),
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
