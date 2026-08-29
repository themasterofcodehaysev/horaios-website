<?php

namespace App\Services;

use App\Models\FooterSetting;
use App\Models\User;
use Illuminate\Support\Str;

class FooterService
{
    public function getPublicFooterSettings(): array
    {
        $settings = FooterSetting::active()->ordered()->get();
        
        return $settings->groupBy('group')->map(function ($items) {
            return $items->mapWithKeys(fn($item) => [$item->key => $this->castValue($item)]);
        })->toArray();
    }

    public function getAllSettings(): \Illuminate\Database\Eloquent\Collection
    {
        return FooterSetting::ordered()->get();
    }

    public function getSettingsByGroup(string $group): \Illuminate\Database\Eloquent\Collection
    {
        return FooterSetting::byGroup($group)->active()->ordered()->get();
    }

    public function createSetting(array $data, ?User $actingUser = null): FooterSetting
    {
        $data['uuid'] = (string) Str::uuid();

        $setting = FooterSetting::create($data);

        AuditLogService::log(
            'create',
            'FooterSetting',
            (string) $setting->id,
            null,
            $setting->only(['key', 'group', 'type']),
            $actingUser?->id
        );

        return $setting;
    }

    public function updateSetting(FooterSetting $setting, array $data, ?User $actingUser = null): FooterSetting
    {
        $oldValues = $setting->only(['value', 'is_active', 'display_order']);

        $setting->update($data);

        AuditLogService::log(
            'update',
            'FooterSetting',
            (string) $setting->id,
            $oldValues,
            $setting->only(['value', 'is_active', 'display_order']),
            $actingUser?->id
        );

        return $setting->fresh();
    }

    public function deleteSetting(FooterSetting $setting, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'FooterSetting',
            (string) $setting->id,
            $setting->only(['key', 'group']),
            null,
            $actingUser?->id
        );

        $setting->delete();
    }

    public function updateSettingsBatch(array $settingsData, ?User $actingUser = null): void
    {
        foreach ($settingsData as $key => $value) {
            FooterSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : $value,
                    'type' => is_array($value) ? 'json' : 'text',
                    'uuid' => (string) Str::uuid(),
                ]
            );
        }

        AuditLogService::log(
            'update',
            'FooterSetting',
            'batch',
            null,
            ['updated_count' => count($settingsData)],
            $actingUser?->id
        );
    }

    public function initializeDefaultSettings(): void
    {
        $defaultSettings = [
            // General
            'footer_logo' => ['value' => '', 'type' => 'image', 'group' => 'general'],
            'footer_description' => ['value' => 'A place to belong, believe, and become.', 'type' => 'text', 'group' => 'general'],
            'footer_copyright' => ['value' => '© 2026 Horaios Baptist Church. All rights reserved.', 'type' => 'text', 'group' => 'general'],
            
            // Contact
            'footer_address' => ['value' => 'Phnom Penh, Cambodia', 'type' => 'text', 'group' => 'contact'],
            'footer_phone' => ['value' => '+855 (0) 23 XXX XXXX', 'type' => 'text', 'group' => 'contact'],
            'footer_email' => ['value' => 'info@horaiosbaptist.org', 'type' => 'text', 'group' => 'contact'],
            
            // Social
            'footer_facebook' => ['value' => 'https://www.facebook.com/profile.php?id=61583373172735', 'type' => 'text', 'group' => 'social'],
            'footer_youtube' => ['value' => 'https://www.youtube.com/@horaiosministrycambodia7430', 'type' => 'text', 'group' => 'social'],
            'footer_instagram' => ['value' => '', 'type' => 'text', 'group' => 'social'],
            'footer_telegram' => ['value' => '', 'type' => 'text', 'group' => 'social'],
            
            // Quick Links
            'footer_quick_links' => ['value' => json_encode([
                ['label' => 'About Us', 'url' => '/about'],
                ['label' => 'Sermons', 'url' => '/sermons'],
                ['label' => 'Events', 'url' => '/events'],
                ['label' => 'Ministries', 'url' => '/ministries'],
                ['label' => 'Contact', 'url' => '/contact'],
            ]), 'type' => 'json', 'group' => 'links'],
        ];

        foreach ($defaultSettings as $key => $data) {
            FooterSetting::firstOrCreate(
                ['key' => $key],
                array_merge($data, ['uuid' => (string) Str::uuid()])
            );
        }
    }

    private function castValue(FooterSetting $setting): mixed
    {
        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }
}
