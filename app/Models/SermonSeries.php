<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class SermonSeries extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sermon_series';

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
        'thumbnail',
        'display_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($series) {
            if (empty($series->uuid)) {
                $series->uuid = (string) Str::uuid();
            }
            if (empty($series->slug)) {
                $series->slug = static::generateUniqueSlug($series->name);
            }
        });

        static::updating(function ($series) {
            if ($series->isDirty('name') && !$series->isDirty('slug')) {
                $series->slug = static::generateUniqueSlug($series->name, $series->id);
            }
        });
    }

    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        $query = static::query();

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            $query->withTrashed();
        }

        while ((clone $query)->where('slug', $slug)->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function sermons(): HasMany
    {
        return $this->hasMany(Sermon::class, 'series_id');
    }
}
