<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavigationMenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'menu_id',
        'parent_id',
        'label',
        'url',
        'is_external',
        'open_in_new_tab',
        'is_active',
        'display_order',
        'icon',
    ];

    protected function casts(): array
    {
        return [
            'is_external' => 'boolean',
            'open_in_new_tab' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(NavigationMenu::class, 'menu_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(NavigationMenuItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(NavigationMenuItem::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
