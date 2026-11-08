<?php

namespace Database\Seeders;

use App\Models\Ministry;
use App\Models\MinistryCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class MinistrySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'admin@horaiosbaptist.org')->first();
        $category = MinistryCategory::first();

        $ministries = [
            [
                'name' => 'Student Dormitory Ministry',
                'description' => 'Providing safe accommodation, Christian community, academic encouragement, and biblical discipleship for university and provincial students studying in Phnom Penh. Launched in October 2015 as the founding cradle of Horaios Baptist Church.',
                'leader' => 'Mr. Chin Than',
                'email' => 'dormitory@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 123',
                'featured_image' => '/images/ministries/dormitory.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Daily',
                'meeting_time' => '18:00',
                'location' => 'House No. 9L, Street 3BT Chamreun Phal-1, Boeung Tompun',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 1,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Children\'s Ministry',
                'description' => 'Nurturing young hearts and minds in the knowledge of God\'s love through age-appropriate biblical teaching, Sunday school lessons, and joyful care.',
                'leader' => 'Mrs. Khiangte Lalrengpuii',
                'email' => 'children@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 124',
                'featured_image' => '/images/ministries/children.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Sunday',
                'meeting_time' => '09:00',
                'location' => 'Children\'s Wing, Main Sanctuary',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 2,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Women\'s Ministry',
                'description' => 'Encouraging and strengthening women in their faith through Bible study, prayer groups, fellowship, and mutual encouragement across families.',
                'leader' => 'San Sophy',
                'email' => 'women@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 125',
                'featured_image' => '/images/ministries/women.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Saturday',
                'meeting_time' => '14:00',
                'location' => 'Fellowship Hall',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 3,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Youth Ministry',
                'description' => 'Empowering high school and university youth to live boldly for Christ through Bible studies, worship, and discipleship opportunities.',
                'leader' => 'Youth Leadership Team',
                'email' => 'youth@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 126',
                'featured_image' => '/images/ministries/youth.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Saturday',
                'meeting_time' => '14:30',
                'location' => 'Youth Hall',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 4,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Worship & Music Ministry',
                'description' => 'Leading the congregation in reverent, authentic praise through music, hymns, and creative expression that exalts the name of Jesus.',
                'leader' => 'Worship Team',
                'email' => 'worship@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 127',
                'featured_image' => '/images/ministries/worship.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Thursday',
                'meeting_time' => '18:30',
                'location' => 'Main Sanctuary',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 5,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Outreach & Mercy Ministry',
                'description' => 'Serving our local community and demonstrating God\'s love in practical action among the poor, orphans, marginalized, and needy families.',
                'leader' => 'Outreach Committee',
                'email' => 'outreach@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 128',
                'featured_image' => '/images/ministries/outreach.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Saturday',
                'meeting_time' => '08:30',
                'location' => 'Boeung Tompun Community Center',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 6,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Prayer Ministry',
                'description' => 'Interceding for our church family, city, nation, and the global Kingdom of God through weekly prayer meetings and intercessory chains.',
                'leader' => 'Intercessory Prayer Team',
                'email' => 'prayer@horaiosbaptist.org',
                'phone' => '+855 (0) 23 880 129',
                'featured_image' => '/images/ministries/prayer.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Wednesday',
                'meeting_time' => '19:00',
                'location' => 'Prayer Room, Main Sanctuary',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 7,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
        ];

        Ministry::whereIn('name', ['Men\'s Ministry', 'Media Ministry'])->delete();

        foreach ($ministries as $ministry) {
            Ministry::updateOrCreate(
                ['name' => $ministry['name']],
                $ministry
            );
        }

        $this->command->info('Ministries seeded successfully.');
    }
}
