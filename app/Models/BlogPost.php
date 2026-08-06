<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'category_id',
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
            'featured'     => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($post) {
            if ($post->status === 'published' && empty($post->published_at)) {
                $post->published_at = now();
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('status') && $post->status === 'published' && empty($post->published_at)) {
                $post->published_at = now();
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
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
