<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ministry extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'description',
        'leader',
        'email',
        'phone',
        'featured_image',
        'category_id',
        'meeting_day',
        'meeting_time',
        'location',
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
            'featured'       => 'boolean',
            'display_order'  => 'integer',
            'published_at'   => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($ministry) {
            if ($ministry->status === 'published' && empty($ministry->published_at)) {
                $ministry->published_at = now();
            }
        });

        static::updating(function ($ministry) {
            if ($ministry->isDirty('status') && $ministry->status === 'published' && empty($ministry->published_at)) {
                $ministry->published_at = now();
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MinistryCategory::class, 'category_id');
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
