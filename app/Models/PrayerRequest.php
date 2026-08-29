<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrayerRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'title',
        'request',
        'request_type',
        'urgency',
        'allow_public_prayer',
        'is_anonymous',
        'status',
        'admin_notes',
        'processed_by',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'allow_public_prayer' => 'boolean',
            'is_anonymous' => 'boolean',
            'processed_at' => 'datetime',
        ];
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function scopePublic($query)
    {
        return $query->where('allow_public_prayer', true)
            ->where('status', '!=', 'archived')
            ->where('status', '!=', 'pending');
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'archived');
    }

    public function scopeByUrgency($query)
    {
        $urgencyOrder = ['urgent' => 1, 'high' => 2, 'medium' => 3, 'low' => 4];
        return $query->orderByRaw('FIELD(urgency, "urgent", "high", "medium", "low")');
    }
}
