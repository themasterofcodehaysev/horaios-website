<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sermon extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'summary',
        'description',
        'speaker_id',
        'series_id',
        'category_id',
        'scripture_reference',
        'youtube_url',
        'video_file',
        'audio_file',
        'thumbnail',
        'featured',
        'status',
        'published_at',
        'display_order',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'featured'      => 'boolean',
            'display_order' => 'integer',
            'published_at'  => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($sermon) {
            if ($sermon->status === 'published' && empty($sermon->published_at)) {
                $sermon->published_at = now();
            }
        });

        static::updating(function ($sermon) {
            if ($sermon->isDirty('status') && $sermon->status === 'published' && empty($sermon->published_at)) {
                $sermon->published_at = now();
            }
        });
    }

    public function speaker(): BelongsTo
    {
        return $this->belongsTo(Speaker::class, 'speaker_id');
    }

    public function series(): BelongsTo
    {
        return $this->belongsTo(SermonSeries::class, 'series_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(SermonCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
