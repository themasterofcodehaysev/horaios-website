<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MinistryCategory extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected static string $slugSourceColumn = 'name';

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
        'display_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }

    public function ministries(): HasMany
    {
        return $this->hasMany(Ministry::class, 'category_id');
    }

    public function publishedMinistries(): HasMany
    {
        return $this->ministries()->where('status', 'published');
    }
}
