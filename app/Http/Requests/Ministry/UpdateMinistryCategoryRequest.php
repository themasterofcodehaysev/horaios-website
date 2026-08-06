<?php

namespace App\Http\Requests\Ministry;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMinistryCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name'          => ['sometimes', 'required', 'string', 'max:255'],
            'slug'          => ['sometimes', 'required', 'string', 'max:255', Rule::unique('ministry_categories', 'slug')->ignore($id)],
            'description'   => ['nullable', 'string', 'max:1000'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'status'        => ['nullable', 'in:active,inactive'],
        ];
    }
}
