<?php

namespace App\Http\Requests\Sermon;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSermonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'title'               => ['sometimes', 'required', 'string', 'max:255'],
            'slug'                => ['nullable', 'string', 'max:255', Rule::unique('sermons', 'slug')->ignore($id)],
            'summary'             => ['nullable', 'string', 'max:1000'],
            'description'         => ['nullable', 'string'],
            'speaker_id'          => ['nullable', 'integer', 'exists:speakers,id'],
            'series_id'           => ['nullable', 'integer', 'exists:sermon_series,id'],
            'category_id'         => ['nullable', 'integer', 'exists:sermon_categories,id'],
            'scripture_reference' => ['nullable', 'string', 'max:255'],
            'youtube_url'         => ['nullable', 'url', 'max:500'],
            'video_file'          => ['nullable', 'string', 'max:500'],
            'audio_file'          => ['nullable', 'string', 'max:500'],
            'thumbnail'           => ['nullable', 'string', 'max:500'],
            'featured'            => ['nullable', 'boolean'],
            'status'              => ['nullable', 'in:draft,published'],
            'published_at'        => ['nullable', 'date'],
            'display_order'       => ['nullable', 'integer', 'min:0'],
        ];
    }
}
