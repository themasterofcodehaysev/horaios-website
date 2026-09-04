<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventCategory extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
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

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'category_id');
    }

    public function publishedEvents(): HasMany
    {
        return $this->events()->where('status', 'published');
    }
}
