<?php

namespace Database\Seeders;

use App\Models\ChurchSetting;
use Illuminate\Database\Seeder;

class ChurchSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'church_name', 'value' => 'Horaios Baptist Church', 'type' => 'string', 'group' => 'general'],
            ['key' => 'short_name', 'value' => 'Horaios Church', 'type' => 'string', 'group' => 'general'],
            ['key' => 'logo', 'value' => '/images/logo.png', 'type' => 'string', 'group' => 'general'],
            ['key' => 'favicon', 'value' => '/favicon.ico', 'type' => 'string', 'group' => 'general'],
            ['key' => 'address', 'value' => 'Phnom Penh, Cambodia', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'phone', 'value' => '+855 (0) 23 XXX XXXX', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'email', 'value' => 'info@horaiosbaptist.org', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'website', 'value' => 'http://127.0.0.1:8000', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'facebook', 'value' => 'https://facebook.com/horaiosbaptist', 'type' => 'string', 'group' => 'social'],
            ['key' => 'youtube', 'value' => 'https://youtube.com/@horaiosbaptist', 'type' => 'string', 'group' => 'social'],
            ['key' => 'telegram', 'value' => 'https://t.me/horaiosbaptist', 'type' => 'string', 'group' => 'social'],
            ['key' => 'instagram', 'value' => 'https://instagram.com/horaiosbaptist', 'type' => 'string', 'group' => 'social'],
            ['key' => 'service_times', 'value' => json_encode([
                ['day' => 'Sunday', 'time' => '09:00 AM & 11:00 AM', 'type' => 'Main Service'],
                ['day' => 'Wednesday', 'time' => '07:00 PM', 'type' => 'Prayer & Study'],
            ]), 'type' => 'json', 'group' => 'general'],
            ['key' => 'latitude', 'value' => '11.5564', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'longitude', 'value' => '104.9282', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'footer_text', 'value' => 'A community of faith serving God and loving our neighbors in Phnom Penh, Cambodia.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'copyright', 'value' => 'Horaios Baptist Church. All rights reserved.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'default_language', 'value' => 'en', 'type' => 'string', 'group' => 'system'],
            ['key' => 'timezone', 'value' => 'Asia/Phnom_Penh', 'type' => 'string', 'group' => 'system'],
        ];

        foreach ($settings as $setting) {
            ChurchSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
