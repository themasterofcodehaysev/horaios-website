<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Media extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'uuid',
        'filename',
        'original_filename',
        'mime_type',
        'extension',
        'size',
        'width',
        'height',
        'disk',
        'path',
        'url',
        'alt_text',
        'caption',
        'uploaded_by',
    ];

    protected $appends = ['size_formatted'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($media) {
            if (empty($media->uuid)) {
                $media->uuid = (string) Str::uuid();
            }
        });
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Human-readable file size accessor (e.g. "1.2 MB").
     */
    protected function sizeFormatted(): Attribute
    {
        return Attribute::get(function () {
            $bytes = $this->size ?? 0;

            if ($bytes >= 1073741824) {
                return number_format($bytes / 1073741824, 2) . ' GB';
            } elseif ($bytes >= 1048576) {
                return number_format($bytes / 1048576, 2) . ' MB';
            } elseif ($bytes >= 1024) {
                return number_format($bytes / 1024, 2) . ' KB';
            }

            return $bytes . ' B';
        });
    }
}
