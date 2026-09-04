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
        'description',
        'display_order',
        'status',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->uuid)) {
                $category->uuid = (string) Str::uuid();
            }
        });
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
