<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChurchSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'is_public',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    public static function set(string $key, mixed $value, string $type = 'string', ?string $group = null): self
    {
        $stringValue = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;

        $setting = static::where('key', $key)->first();
        if ($setting) {
            $data = ['value' => $stringValue, 'type' => $type];
            if ($group !== null) {
                $data['group'] = $group;
            }
            $setting->update($data);
            return $setting;
        }

        return static::create([
            'key' => $key,
            'value' => $stringValue,
            'type' => $type,
            'group' => $group ?? 'general',
            'is_public' => true,
        ]);
    }
}
