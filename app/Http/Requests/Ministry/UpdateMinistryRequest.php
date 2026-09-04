<?php

namespace App\Http\Requests\Ministry;

use App\Services\HtmlSanitizerService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMinistryRequest extends FormRequest
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
            'name'           => ['sometimes', 'required', 'string', 'max:255'],
            'description'    => ['sometimes', 'required', 'string'],
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
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('description')) {
            $this->merge([
                'description' => $this->sanitizer->sanitize($this->input('description', '')),
            ]);
        }
    }
}
