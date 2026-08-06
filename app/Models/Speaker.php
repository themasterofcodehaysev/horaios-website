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
        'slug',
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
            if (empty($speaker->slug)) {
                $speaker->slug = static::generateUniqueSlug($speaker->name);
            }
        });

        static::updating(function ($speaker) {
            if ($speaker->isDirty('name') && !$speaker->isDirty('slug')) {
                $speaker->slug = static::generateUniqueSlug($speaker->name, $speaker->id);
            }
        });
    }

    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function sermons(): HasMany
    {
        return $this->hasMany(Sermon::class, 'speaker_id');
    }
}
