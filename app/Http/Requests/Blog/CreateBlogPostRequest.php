<?php

namespace App\Http\Requests\Blog;

use App\Services\HtmlSanitizerService;
use Illuminate\Foundation\Http\FormRequest;

class CreateBlogPostRequest extends FormRequest
{
    protected HtmlSanitizerService $sanitizer;

    public function __construct(HtmlSanitizerService $sanitizer)
    {
        parent::__construct();
        $this->sanitizer = $sanitizer;
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'           => ['required', 'string', 'max:255'],
            'excerpt'         => ['nullable', 'string', 'max:1000'],
            'content'         => ['required', 'string'],
            'featured_image'  => ['nullable', 'string', 'max:500'],
            'category_id'     => ['nullable', 'integer', 'exists:blog_categories,id'],
            'featured'        => ['nullable', 'boolean'],
            'status'          => ['nullable', 'in:draft,published'],
            'published_at'    => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'content' => $this->sanitizer->sanitize($this->input('content', '')),
            'excerpt' => $this->sanitizer->sanitizeSimple($this->input('excerpt', '')),
        ]);
    }
}
