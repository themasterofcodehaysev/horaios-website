<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait HasUuidAndSlug
{
    protected static function bootHasUuidAndSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public static function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $slug = Str::slug($source);
        $originalSlug = $slug;
        $counter = 1;

        $query = static::query();

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            $query->withTrashed();
        }

        while ((clone $query)
            ->where('slug', $slug)
            ->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    protected static function slugSourceColumn(): string
    {
        return property_exists(static::class, 'slugSourceColumn')
            ? static::$slugSourceColumn
            : 'title';
    }
}
