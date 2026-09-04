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
            ChurchSetting::set($key, $value, $type);
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
