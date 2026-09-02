<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'admin@horaiosbaptist.org')->first();
        $category = EventCategory::first();

        $events = [
            [
                'title' => 'Sunday Worship Service',
                'slug' => 'sunday-worship-service',
                'description' => 'Join us for our weekly Sunday worship service with uplifting music, biblical teaching, and community fellowship.',
                'featured_image' => '/images/events/sunday-service.jpg',
                'category_id' => $category?->id,
                'location' => 'Main Sanctuary, Horaios Baptist Church',
                'google_map_url' => '',
                'start_date' => now()->addDays(2)->toDateString(),
                'end_date' => now()->addDays(2)->toDateString(),
                'start_time' => '09:00',
                'end_time' => '11:00',
                'registration_required' => false,
                'registration_limit' => null,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(30),
                'seo_title' => 'Sunday Worship Service - Horaios Baptist Church',
                'seo_description' => 'Join our Sunday worship service at 9:00 AM for uplifting music, biblical teaching, and community fellowship.',
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Weekly Bible Study',
                'slug' => 'weekly-bible-study',
                'description' => 'Deep dive into Scripture with our Wednesday evening Bible study. This week: The Book of Romans.',
                'featured_image' => '/images/events/bible-study.jpg',
                'category_id' => $category?->id,
                'location' => 'Fellowship Hall, Horaios Baptist Church',
                'google_map_url' => '',
                'start_date' => now()->addDays(5)->toDateString(),
                'end_date' => now()->addDays(5)->toDateString(),
                'start_time' => '19:00',
                'end_time' => '20:30',
                'registration_required' => false,
                'registration_limit' => null,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(20),
                'seo_title' => 'Weekly Bible Study - The Book of Romans',
                'seo_description' => 'Join our Wednesday evening Bible study at 7:00 PM. This week we are studying the Book of Romans.',
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Youth Ministry Retreat',
                'slug' => 'youth-ministry-retreat',
                'description' => 'Annual youth retreat at Kirirom National Park. A weekend of worship, teaching, and outdoor activities for teens.',
                'featured_image' => '/images/events/youth-retreat.jpg',
                'category_id' => $category?->id,
                'location' => 'Kirirom National Park, Kampong Speu Province',
                'google_map_url' => '',
                'start_date' => now()->addDays(14)->toDateString(),
                'end_date' => now()->addDays(16)->toDateString(),
                'start_time' => '10:00',
                'end_time' => '16:00',
                'registration_required' => true,
                'registration_limit' => 50,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(15),
                'seo_title' => 'Youth Ministry Retreat 2026',
                'seo_description' => 'Join our annual youth retreat at Kirirom National Park. A weekend of worship, teaching, and outdoor activities for teens.',
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Community Food Drive',
                'slug' => 'community-food-drive',
                'description' => 'Help us collect and distribute food to families in need in our local community. Volunteers welcome!',
                'featured_image' => '/images/events/food-drive.jpg',
                'category_id' => $category?->id,
                'location' => 'Horaios Baptist Church Parking Lot',
                'google_map_url' => '',
                'start_date' => now()->addDays(7)->toDateString(),
                'end_date' => now()->addDays(7)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '14:00',
                'registration_required' => false,
                'registration_limit' => null,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(10),
                'seo_title' => 'Community Food Drive - Volunteer Opportunity',
                'seo_description' => 'Join our community food drive to help families in need. Volunteers welcome! Help collect and distribute food in Phnom Penh.',
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Church Anniversary Celebration',
                'slug' => 'church-anniversary-celebration',
                'description' => 'Celebrate 5 years of God\'s faithfulness at Horaios Baptist Church! Special service, lunch, and family activities.',
                'featured_image' => '/images/events/anniversary.jpg',
                'category_id' => $category?->id,
                'location' => 'Main Sanctuary & Fellowship Hall, Horaios Baptist Church',
                'google_map_url' => '',
                'start_date' => now()->addDays(30)->toDateString(),
                'end_date' => now()->addDays(30)->toDateString(),
                'start_time' => '10:00',
                'end_time' => '15:00',
                'registration_required' => true,
                'registration_limit' => 200,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'seo_title' => '5th Church Anniversary Celebration',
                'seo_description' => 'Celebrate 5 years of God\'s faithfulness at Horaios Baptist Church! Special service, lunch, and family activities.',
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
        ];

        foreach ($events as $event) {
            Event::updateOrCreate(
                ['slug' => $event['slug']],
                $event
            );
        }

        $this->command->info('Events seeded successfully.');
    }
}
