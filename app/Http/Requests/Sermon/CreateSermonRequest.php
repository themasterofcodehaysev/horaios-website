<?php

namespace App\Http\Requests\Sermon;

use App\Services\HtmlSanitizerService;
use Illuminate\Foundation\Http\FormRequest;

class CreateSermonRequest extends FormRequest
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
            'title'               => ['required', 'string', 'max:255'],
            'summary'             => ['nullable', 'string', 'max:1000'],
            'description'         => ['nullable', 'string'],
            'speaker_id'          => ['nullable', 'integer', 'exists:speakers,id'],
            'series_id'           => ['nullable', 'integer', 'exists:sermon_series,id'],
            'category_id'         => ['nullable', 'integer', 'exists:sermon_categories,id'],
            'scripture_reference' => ['nullable', 'string', 'max:255'],
            'youtube_url'         => ['nullable', 'url', 'max:500'],
            'video_file'          => ['nullable', 'string', 'max:500'],
            'audio_file'          => ['nullable', 'string', 'max:500'],
            'thumbnail'           => ['nullable', 'string', 'max:500'],
            'featured'            => ['nullable', 'boolean'],
            'status'              => ['nullable', 'in:draft,published'],
            'published_at'        => ['nullable', 'date'],
            'display_order'       => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'description' => $this->sanitizer->sanitize($this->input('description', '')),
            'summary' => $this->sanitizer->sanitizeSimple($this->input('summary', '')),
        ]);
    }
}
