<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => ['sometimes', 'required', 'string', 'max:255'],
            'description'   => ['nullable', 'string', 'max:1000'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status'        => ['nullable', 'in:active,inactive'],
        ];
    }
}
