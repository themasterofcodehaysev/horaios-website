<?php

namespace App\Http\Requests\Ministry;

use Illuminate\Foundation\Http\FormRequest;

class CreateMinistryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'slug'           => ['nullable', 'string', 'max:255', 'unique:ministries,slug'],
            'description'    => ['required', 'string'],
            'leader'         => ['nullable', 'string', 'max:255'],
            'email'          => ['nullable', 'email', 'max:255'],
            'phone'          => ['nullable', 'string', 'max:50'],
            'featured_image' => ['nullable', 'string', 'max:500'],
            'category_id'    => ['nullable', 'integer', 'exists:ministry_categories,id'],
            'meeting_day'    => ['nullable', 'string', 'max:50'],
            'meeting_time'   => ['nullable', 'string', 'max:20'],
            'location'       => ['nullable', 'string', 'max:500'],
            'featured'       => ['nullable', 'boolean'],
            'status'         => ['nullable', 'in:draft,published'],
            'display_order'  => ['nullable', 'integer', 'min:0'],
            'published_at'   => ['nullable', 'date'],
            'seo_title'      => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_image'      => ['nullable', 'string', 'max:500'],
            'canonical_url'  => ['nullable', 'url', 'max:500'],
        ];
    }
}
