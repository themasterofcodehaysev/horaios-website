<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'description',
        'featured_image',
        'category_id',
        'location',
        'google_map_url',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'registration_required',
        'registration_limit',
        'featured',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_image',
        'canonical_url',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'featured'              => 'boolean',
            'registration_required' => 'boolean',
            'registration_limit'    => 'integer',
            'start_date'            => 'date',
            'end_date'              => 'date',
            'published_at'          => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($event) {
            if ($event->status === 'published' && empty($event->published_at)) {
                $event->published_at = now();
            }
        });

        static::updating(function ($event) {
            if ($event->isDirty('status') && $event->status === 'published' && empty($event->published_at)) {
                $event->published_at = now();
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getEventStatusAttribute(): string
    {
        if ($this->status === 'cancelled') {
            return 'cancelled';
        }

        $today = now()->toDateString();
        $start = $this->start_date?->toDateString();
        $end = $this->end_date?->toDateString() ?? $start;
        $now = now();

        if ($this->start_date && $this->start_time) {
            $startDateTime = $this->start_date->setTimeFromTimeString($this->start_time);
            $endDateTime = $this->end_date
                ? $this->end_date->setTimeFromTimeString($this->end_time ?? '23:59:59')
                : $startDateTime->addHour();

            if ($now->lt($startDateTime)) {
                return 'upcoming';
            }

            if ($now->between($startDateTime, $endDateTime)) {
                return 'ongoing';
            }

            return 'completed';
        }

        if ($start > $today) return 'upcoming';
        if ($end < $today) return 'completed';
        return 'today';
    }
}
