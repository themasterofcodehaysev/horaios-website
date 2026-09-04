<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Speaker extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'photo',
        'biography',
        'position',
        'email',
        'facebook',
        'status',
        'display_order',
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

        static::creating(function ($speaker) {
            if (empty($speaker->uuid)) {
                $speaker->uuid = (string) Str::uuid();
            }
        });
    }

    public function sermons(): HasMany
    {
        return $this->hasMany(Sermon::class, 'speaker_id');
    }
}
