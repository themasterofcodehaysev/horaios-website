<?php

namespace App\Http\Requests\Song;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSongRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'         => ['sometimes', 'required', 'string', 'max:255'],
            'artist'        => ['nullable', 'string', 'max:255'],
            'composer'      => ['nullable', 'string', 'max:255'],
            'category_id'   => ['nullable', 'integer', 'exists:song_categories,id'],
            'lyrics'        => ['sometimes', 'required', 'string'],
            'featured'      => ['boolean'],
            'status'        => ['sometimes', 'required', 'string', 'in:draft,published'],
            'display_order' => ['integer', 'min:0'],
        ];
    }
}
