<?php

namespace App\Http\Requests\Prayer;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePrayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', 'in:pending,reviewed,praying,completed,archived'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'urgency' => ['nullable', 'in:low,medium,high,urgent'],
            'allow_public_prayer' => ['nullable', 'boolean'],
        ];
    }
}
