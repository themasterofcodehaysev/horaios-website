<?php

namespace Database\Seeders;

use App\Models\ChurchSetting;
use Illuminate\Database\Seeder;

class ChurchSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General Settings
            ['key' => 'church_name', 'value' => 'Horaios Baptist Church', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'short_name', 'value' => 'Horaios Church', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'logo', 'value' => '/images/logo.png', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'favicon', 'value' => '/images/logo.png', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'footer_text', 'value' => 'A community of faith serving God and loving our neighbors in Phnom Penh, Cambodia.', 'type' => 'string', 'group' => 'general', 'is_public' => true],
            ['key' => 'copyright', 'value' => 'Horaios Baptist Church. All rights reserved.', 'type' => 'string', 'group' => 'general', 'is_public' => true],

            // Contact Settings
            ['key' => 'address', 'value' => 'St 348, Boeung Kengkang 3, Boeung Kengkang Phnom Penh, Phnom Penh 12304, Cambodia', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'phone', 'value' => '+855 (0) 23 XXX XXXX', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'email', 'value' => 'info@horaiosbaptist.org', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'website', 'value' => 'https://horaiosbaptist.org', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'google_map_url', 'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4809.946438997397!2d104.91625177584446!3d11.54927884446157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109510006583b63%3A0x23e77b1245380116!2sHoraios%20Baptist%20Church%20BKK3!5e1!3m2!1sen!2skh!4v1788250739009!5m2!1sen!2skh', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'google_map_directions_url', 'value' => 'https://maps.app.goo.gl/mv2ySxeKLS1dP4jZA', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'latitude', 'value' => '11.5564', 'type' => 'string', 'group' => 'contact', 'is_public' => true],
            ['key' => 'longitude', 'value' => '104.9282', 'type' => 'string', 'group' => 'contact', 'is_public' => true],

            // Social Media Settings
            ['key' => 'facebook', 'value' => 'https://www.facebook.com/profile.php?id=61583373172735', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'youtube', 'value' => 'https://www.youtube.com/@horaiosministrycambodia7430', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'telegram', 'value' => 'https://t.me/horaiosbaptist', 'type' => 'string', 'group' => 'social', 'is_public' => true],
            ['key' => 'instagram', 'value' => 'https://instagram.com/horaiosbaptist', 'type' => 'string', 'group' => 'social', 'is_public' => true],

            // Advanced Settings
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean', 'group' => 'advanced', 'is_public' => false],
            ['key' => 'maintenance_message', 'value' => 'We are currently under maintenance. Please check back soon.', 'type' => 'text', 'group' => 'advanced', 'is_public' => false],
            ['key' => 'analytics_id', 'value' => '', 'type' => 'string', 'group' => 'advanced', 'is_public' => false],
            ['key' => 'custom_css', 'value' => '', 'type' => 'text', 'group' => 'advanced', 'is_public' => false],
            ['key' => 'custom_js', 'value' => '', 'type' => 'text', 'group' => 'advanced', 'is_public' => false],

            // System Settings
            ['key' => 'default_language', 'value' => 'en', 'type' => 'string', 'group' => 'system', 'is_public' => false],
            ['key' => 'timezone', 'value' => 'Asia/Phnom_Penh', 'type' => 'string', 'group' => 'system', 'is_public' => false],

            // Giving & Contribution Settings
            ['key' => 'giving_enabled', 'value' => 'true', 'type' => 'boolean', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_qr_image', 'value' => '', 'type' => 'string', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_bank_name', 'value' => 'ABA Bank (KHQR)', 'type' => 'string', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_account_name', 'value' => 'Horaios Baptist Church', 'type' => 'string', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_account_number', 'value' => '001 234 567', 'type' => 'string', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_currency', 'value' => 'USD / KHR', 'type' => 'string', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_instructions', 'value' => "1. Open any mobile banking app with KHQR/Bakong support (e.g. ABA Mobile, Acleda, Bakong).\n2. Tap Scan QR and scan the church code.\n3. Enter the giving amount and add 'Tithe' or 'Offering' in the remarks.\n4. Confirm your transfer.", 'type' => 'text', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_online_url', 'value' => '', 'type' => 'string', 'group' => 'giving', 'is_public' => true],
            ['key' => 'giving_note', 'value' => 'Your faithful giving supports worship services, community outreach, and Gospel ministries.', 'type' => 'text', 'group' => 'giving', 'is_public' => true],
        ];

        foreach ($settings as $setting) {
            ChurchSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
