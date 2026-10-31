<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait HasUuidAndSlug
{
    public static array $hasSlugColumnCache = [];

    public static function hasSlugColumn(): bool
    {
        $table = (new static)->getTable();
        if (app()->environment('testing')) {
            try {
                return \Illuminate\Support\Facades\Schema::hasColumn($table, 'slug');
            } catch (\Throwable) {
                return false;
            }
        }

        if (!array_key_exists($table, static::$hasSlugColumnCache)) {
            try {
                static::$hasSlugColumnCache[$table] = \Illuminate\Support\Facades\Schema::hasColumn($table, 'slug');
            } catch (\Throwable) {
                static::$hasSlugColumnCache[$table] = false;
            }
        }
        return static::$hasSlugColumnCache[$table];
    }

    protected static function bootHasUuidAndSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }

            if (static::hasSlugColumn() && empty($model->slug)) {
                $source = static::getSlugSourceValue($model);
                if (!empty($source)) {
                    $model->slug = static::generateUniqueSlug($source);
                }
            }
        });

        static::updating(function ($model) {
            if (static::hasSlugColumn()) {
                $sourceCol = static::slugSourceColumnName($model);
                $sourceVal = static::getSlugSourceValue($model);
                if ($model->isDirty($sourceCol) && !$model->isDirty('slug') && !empty($sourceVal)) {
                    $model->slug = static::generateUniqueSlug($sourceVal, $model->id);
                }
            }
        });
    }

    protected static function slugSourceColumnName($model): string
    {
        $column = static::slugSourceColumn();
        if (!empty($model->getAttribute($column))) {
            return $column;
        }

        if (!empty($model->getAttribute('name'))) {
            return 'name';
        }

        if (!empty($model->getAttribute('title'))) {
            return 'title';
        }

        return $column;
    }

    protected static function getSlugSourceValue($model): ?string
    {
        $column = static::slugSourceColumn();
        $val = $model->getAttribute($column);
        if (!empty($val)) {
            return (string) $val;
        }

        $name = $model->getAttribute('name');
        if (!empty($name)) {
            return (string) $name;
        }

        $title = $model->getAttribute('title');
        if (!empty($title)) {
            return (string) $title;
        }

        return null;
    }

    public static function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $slug = Str::slug($source);
        $originalSlug = $slug ?: 'item';
        $slug = $originalSlug;
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
