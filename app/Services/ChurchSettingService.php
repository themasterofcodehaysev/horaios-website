<?php

namespace App\Services;

use App\Models\ChurchSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ChurchSettingService
{
    public function getAllSettings(): Collection
    {
        return ChurchSetting::all();
    }

    /**
     * Batch update church settings and return the updated records.
     */
    public function updateSettings(array $settings, ?User $actingUser = null): Collection
    {
        $oldValues = ChurchSetting::all()->pluck('value', 'key')->toArray();

        foreach ($settings as $key => $value) {
            $type = is_array($value) ? 'json' : (is_bool($value) ? 'boolean' : 'string');
            $group = null;
            if (str_starts_with($key, 'giving_')) {
                $group = 'giving';
            } elseif (in_array($key, ['church_name', 'short_name', 'logo', 'favicon', 'footer_text', 'copyright'])) {
                $group = 'general';
            } elseif (in_array($key, ['address', 'phone', 'email', 'website', 'google_map_url', 'google_map_directions_url', 'latitude', 'longitude'])) {
                $group = 'contact';
            } elseif (in_array($key, ['facebook', 'youtube', 'telegram', 'instagram', 'twitter', 'tiktok'])) {
                $group = 'social';
            } elseif (in_array($key, ['maintenance_mode', 'maintenance_message', 'analytics_id', 'custom_css', 'custom_js'])) {
                $group = 'advanced';
            } elseif (in_array($key, ['default_language', 'timezone'])) {
                $group = 'system';
            }
            ChurchSetting::set($key, $value, $type, $group);
        }

        AuditLogService::log(
            'update',
            'ChurchSetting',
            'bulk',
            $oldValues,
            $settings,
            $actingUser?->id
        );

        app(CacheService::class)->clearChurchSettingsCache();

        // Return the updated records for the affected keys
        return ChurchSetting::whereIn('key', array_keys($settings))->get();
    }
}
