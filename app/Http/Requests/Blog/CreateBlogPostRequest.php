<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class CreateBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'           => ['required', 'string', 'max:255'],
            'slug'            => ['nullable', 'string', 'max:255', 'unique:blog_posts,slug'],
            'excerpt'         => ['nullable', 'string', 'max:1000'],
            'content'         => ['required', 'string'],
            'featured_image'  => ['nullable', 'string', 'max:500'],
            'category_id'     => ['nullable', 'integer', 'exists:blog_categories,id'],
            'featured'        => ['nullable', 'boolean'],
            'status'          => ['nullable', 'in:draft,published'],
            'published_at'    => ['nullable', 'date'],
            'seo_title'       => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_image'       => ['nullable', 'string', 'max:500'],
            'canonical_url'   => ['nullable', 'url', 'max:500'],
        ];
    }
}
