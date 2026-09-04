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
        });
    }

    public function sermons(): HasMany
    {
        return $this->hasMany(Sermon::class, 'series_id');
    }
}
