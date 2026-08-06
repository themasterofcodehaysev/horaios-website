<?php

namespace App\Models;

use App\Models\Concerns\HasUuidAndSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SermonCategory extends Model
{
    use HasFactory, HasUuidAndSlug, SoftDeletes;

    protected $table = 'sermon_categories';

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

    protected static string $slugSourceColumn = 'name';

    public function sermons(): HasMany
    {
        return $this->hasMany(Sermon::class, 'category_id');
    }
}
