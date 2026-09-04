<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('end_date') && !$this->has('start_date')) {
            $eventId = $this->route('id');
            if ($eventId) {
                $event = \App\Models\Event::find($eventId);
                if ($event) {
                    $this->merge(['start_date' => $event->start_date]);
                }
            }
        }
    }

    public function rules(): array
    {
        return [
            'title'                => ['sometimes', 'required', 'string', 'max:255'],
            'description'          => ['sometimes', 'required', 'string'],
            'featured_image'       => ['nullable', 'string', 'max:500'],
            'category_id'          => ['nullable', 'integer', 'exists:event_categories,id'],
            'location'             => ['nullable', 'string', 'max:500'],
            'google_map_url'       => ['nullable', 'string', 'max:2000'],
            'start_date'           => ['sometimes', 'required', 'date'],
            'end_date'             => ['nullable', 'date', 'after_or_equal:start_date'],
            'start_time'           => ['nullable', 'string', 'max:20'],
            'end_time'             => ['nullable', 'string', 'max:20'],
            'registration_required' => ['nullable', 'boolean'],
            'registration_limit'   => ['nullable', 'integer', 'min:0'],
            'featured'             => ['nullable', 'boolean'],
            'status'               => ['nullable', 'in:draft,published,cancelled'],
            'published_at'         => ['nullable', 'date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $startDate = $this->input('start_date');
            $endDate = $this->input('end_date');
            $startTime = $this->input('start_time');
            $endTime = $this->input('end_time');

            if ($startDate && $endDate && $startDate === $endDate && $startTime && $endTime) {
                if (strtotime($endTime) <= strtotime($startTime)) {
                    $validator->errors()->add('end_time', 'The end time must be after the start time for same-day events.');
                }
            }
        });
    }
}
