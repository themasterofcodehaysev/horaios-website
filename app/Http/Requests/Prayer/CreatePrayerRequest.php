<?php

namespace App\Http\Requests\Prayer;

use Illuminate\Foundation\Http\FormRequest;

class CreatePrayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'request' => ['required', 'string', 'min:10', 'max:5000'],
            'request_type' => ['nullable', 'in:general,healing,guidance,thanksgiving,emergency'],
            'urgency' => ['nullable', 'in:low,medium,high,urgent'],
            'allow_public_prayer' => ['nullable', 'boolean'],
            'is_anonymous' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please provide your name',
            'title.required' => 'Please provide a title for your prayer request',
            'request.required' => 'Please describe your prayer request',
            'request.min' => 'Your prayer request must be at least 10 characters',
            'request.max' => 'Your prayer request cannot exceed 5000 characters',
        ];
    }
}
