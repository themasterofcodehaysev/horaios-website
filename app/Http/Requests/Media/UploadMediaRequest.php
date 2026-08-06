<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('media.manage');
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:51200'], // max 50MB
        ];
    }
}
