<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class SongCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
        'display_order',
        'status',
    ];

    protected static ?bool $hasSlugColumn = null;

    public static function hasSlugColumn(): bool
    {
        if (static::$hasSlugColumn === null) {
            try {
                static::$hasSlugColumn = \Illuminate\Support\Facades\Schema::hasColumn('song_categories', 'slug');
            } catch (\Throwable) {
                static::$hasSlugColumn = false;
            }
        }

        return static::$hasSlugColumn;
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->uuid)) {
                $category->uuid = (string) Str::uuid();
            }

            if (static::hasSlugColumn() && empty($category->slug) && !empty($category->name)) {
                $category->slug = static::generateUniqueSlug($category->name);
            }
        });

        static::updating(function ($category) {
            if (static::hasSlugColumn() && $category->isDirty('name') && !$category->isDirty('slug') && !empty($category->name)) {
                $category->slug = static::generateUniqueSlug($category->name, $category->id);
            }
        });
    }

    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug ?: 'category';
        $slug = $originalSlug;
        $counter = 1;

        $query = static::query();

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            $query->withTrashed();
        }

        while ((clone $query)
            ->where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function songs(): HasMany
    {
        return $this->hasMany(Song::class, 'category_id');
    }

    public function publishedSongs(): HasMany
    {
        return $this->hasMany(Song::class, 'category_id')->where('status', 'published');
    }
}
