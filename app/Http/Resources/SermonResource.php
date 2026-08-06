<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SermonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'uuid'                => $this->uuid,
            'title'               => $this->title,
            'slug'                => $this->slug,
            'summary'             => $this->summary,
            'description'         => $this->description,
            'scripture_reference' => $this->scripture_reference,
            'youtube_url'         => $this->youtube_url,
            'video_file'          => $this->video_file,
            'audio_file'          => $this->audio_file,
            'thumbnail'           => $this->thumbnail,
            'featured'            => (bool) $this->featured,
            'status'              => $this->status,
            'published_at'        => $this->published_at?->toISOString(),
            'display_order'       => $this->display_order,
            'speaker_id'          => $this->speaker_id,
            'series_id'           => $this->series_id,
            'category_id'         => $this->category_id,
            'speaker'             => new SpeakerResource($this->whenLoaded('speaker')),
            'series'              => new SermonSeriesResource($this->whenLoaded('series')),
            'category'            => new SermonCategoryResource($this->whenLoaded('category')),
            'created_by'          => $this->whenLoaded('creator', fn() => [
                'id'           => $this->creator->id,
                'display_name' => $this->creator->display_name,
                'email'        => $this->creator->email,
            ]),
            'updated_by'          => $this->whenLoaded('updater', fn() => [
                'id'           => $this->updater->id,
                'display_name' => $this->updater->display_name,
                'email'        => $this->updater->email,
            ]),
            'created_at'          => $this->created_at?->toISOString(),
            'updated_at'          => $this->updated_at?->toISOString(),
        ];
    }
}
