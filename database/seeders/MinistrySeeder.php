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
                'name' => 'Children\'s Ministry',
                'description' => 'Nurturing young hearts and minds in the knowledge of God\'s love through age-appropriate teaching, activities, and care. Meets Sunday mornings at 9:00 AM.',
                'leader' => 'Sarah Johnson',
                'email' => 'children@horaiosbaptist.org',
                'phone' => '+855 (0) 23 123 4567',
                'featured_image' => '/images/ministries/children.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Sunday',
                'meeting_time' => '09:00',
                'location' => 'Children\'s Wing, Main Building',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 1,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Youth Ministry',
                'description' => 'Empowering the next generation to live out their faith through worship, fellowship, and service opportunities. Meets Wednesday evenings at 7:00 PM.',
                'leader' => 'David Chen',
                'email' => 'youth@horaiosbaptist.org',
                'phone' => '+855 (0) 23 234 5678',
                'featured_image' => '/images/ministries/youth.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Wednesday',
                'meeting_time' => '19:00',
                'location' => 'Youth Center, Main Building',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 2,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Worship Ministry',
                'description' => 'Leading the congregation in authentic worship through music, art, and creative expression that honors God. Meets Thursday evenings at 7:00 PM.',
                'leader' => 'Michael Williams',
                'email' => 'worship@horaiosbaptist.org',
                'phone' => '+855 (0) 23 345 6789',
                'featured_image' => '/images/ministries/worship.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Thursday',
                'meeting_time' => '19:00',
                'location' => 'Main Sanctuary',
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 3,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Outreach Ministry',
                'description' => 'Serving our local community through food distribution, visitation programs, and partnership with local organizations. Meets Saturday mornings at 8:00 AM.',
                'leader' => 'Lisa Park',
                'email' => 'outreach@horaiosbaptist.org',
                'phone' => '+855 (0) 23 456 7890',
                'featured_image' => '/images/ministries/outreach.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Saturday',
                'meeting_time' => '08:00',
                'location' => 'Church Parking Lot & Community Center',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 4,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Men\'s Ministry',
                'description' => 'Building strong men of faith through fellowship, accountability, and practical teaching for daily living. Meets Tuesday mornings at 6:30 AM.',
                'leader' => 'James Brown',
                'email' => 'men@horaiosbaptist.org',
                'phone' => '+855 (0) 23 567 8901',
                'featured_image' => '/images/ministries/men.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Tuesday',
                'meeting_time' => '06:30',
                'location' => 'Fellowship Hall',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 5,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Women\'s Ministry',
                'description' => 'Encouraging women in their faith journey through Bible studies, prayer groups, and meaningful relationships. Meets Monday mornings at 10:00 AM.',
                'leader' => 'Maria Garcia',
                'email' => 'women@horaiosbaptist.org',
                'phone' => '+855 (0) 23 678 9012',
                'featured_image' => '/images/ministries/women.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Monday',
                'meeting_time' => '10:00',
                'location' => 'Fellowship Hall',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 6,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Prayer Ministry',
                'description' => 'Interceding for our church, community, and world through regular prayer meetings and prayer chains. Meets Wednesday evenings at 6:00 PM.',
                'leader' => 'Thomas Lee',
                'email' => 'prayer@horaiosbaptist.org',
                'phone' => '+855 (0) 23 789 0123',
                'featured_image' => '/images/ministries/prayer.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Wednesday',
                'meeting_time' => '18:00',
                'location' => 'Prayer Room, Main Building',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 7,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'name' => 'Media Ministry',
                'description' => 'Supporting church services and events through audio, video, and lighting production for effective communication. Serves on Sunday mornings at 8:00 AM.',
                'leader' => 'Kevin Miller',
                'email' => 'media@horaiosbaptist.org',
                'phone' => '+855 (0) 23 890 1234',
                'featured_image' => '/images/ministries/media.jpg',
                'category_id' => $category?->id,
                'meeting_day' => 'Sunday',
                'meeting_time' => '08:00',
                'location' => 'Sound Booth & Control Room',
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(60),
                'display_order' => 8,
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
        ];

        foreach ($ministries as $ministry) {
            Ministry::updateOrCreate(
                ['name' => $ministry['name']],
                $ministry
            );
        }

        $this->command->info('Ministries seeded successfully.');
    }
}
