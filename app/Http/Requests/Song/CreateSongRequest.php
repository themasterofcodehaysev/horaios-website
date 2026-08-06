<?php

namespace App\Http\Requests\Song;

use Illuminate\Foundation\Http\FormRequest;

class CreateSongRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'         => ['required', 'string', 'max:255'],
            'slug'          => ['nullable', 'string', 'max:255', 'unique:songs,slug'],
            'artist'        => ['nullable', 'string', 'max:255'],
            'composer'      => ['nullable', 'string', 'max:255'],
            'category_id'   => ['nullable', 'integer', 'exists:song_categories,id'],
            'lyrics'        => ['required', 'string'],
            'featured'      => ['boolean'],
            'status'        => ['required', 'string', 'in:draft,published'],
            'display_order' => ['integer', 'min:0'],
        ];
    }
}
