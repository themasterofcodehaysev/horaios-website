<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'title'                => ['sometimes', 'required', 'string', 'max:255'],
            'slug'                 => ['nullable', 'string', 'max:255', Rule::unique('events', 'slug')->ignore($id)],
            'description'          => ['sometimes', 'required', 'string'],
            'featured_image'       => ['nullable', 'string', 'max:500'],
            'category_id'          => ['nullable', 'integer', 'exists:event_categories,id'],
            'location'             => ['nullable', 'string', 'max:500'],
            'google_map_url'       => ['nullable', 'url', 'max:500'],
            'start_date'           => ['sometimes', 'required', 'date'],
            'end_date'             => ['nullable', 'date', 'after:start_date'],
            'start_time'           => ['nullable', 'string', 'max:20'],
            'end_time'             => ['nullable', 'string', 'max:20'],
            'registration_required' => ['nullable', 'boolean'],
            'registration_limit'   => ['nullable', 'integer', 'min:0'],
            'featured'             => ['nullable', 'boolean'],
            'status'               => ['nullable', 'in:draft,published,cancelled'],
            'published_at'         => ['nullable', 'date'],
            'seo_title'            => ['nullable', 'string', 'max:255'],
            'seo_description'      => ['nullable', 'string', 'max:500'],
            'seo_image'            => ['nullable', 'string', 'max:500'],
            'canonical_url'        => ['nullable', 'url', 'max:500'],
        ];
    }
}
