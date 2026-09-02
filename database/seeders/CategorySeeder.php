<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\EventCategory;
use App\Models\MinistryCategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Blog Categories
        $blogCategories = [
            ['name' => 'Church News', 'slug' => 'church-news', 'description' => 'Updates and announcements from our church community'],
            ['name' => 'Sermon Series', 'slug' => 'sermon-series', 'description' => 'Resources and insights from our current sermon series'],
            ['name' => 'Community Stories', 'slug' => 'community-stories', 'description' => 'Stories of transformation and testimonies from our members'],
            ['name' => 'Events & Activities', 'slug' => 'events-activities', 'description' => 'Highlights from church events and community activities'],
        ];

        foreach ($blogCategories as $category) {
            BlogCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        // Event Categories
        $eventCategories = [
            ['name' => 'Worship Services', 'slug' => 'worship-services', 'description' => 'Regular and special worship services'],
            ['name' => 'Small Groups', 'slug' => 'small-groups', 'description' => 'Bible studies and small group gatherings'],
            ['name' => 'Outreach Events', 'slug' => 'outreach-events', 'description' => 'Community outreach and service events'],
            ['name' => 'Youth & Kids', 'slug' => 'youth-kids', 'description' => 'Events for children and youth'],
            ['name' => 'Special Events', 'slug' => 'special-events', 'description' => 'Conferences, retreats, and special celebrations'],
        ];

        foreach ($eventCategories as $category) {
            EventCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        // Ministry Categories
        $ministryCategories = [
            ['name' => 'Ministry Teams', 'slug' => 'ministry-teams', 'description' => 'Ongoing ministry teams and service groups'],
            ['name' => 'Outreach', 'slug' => 'outreach', 'description' => 'Community outreach and service ministries'],
            ['name' => 'Discipleship', 'slug' => 'discipleship', 'description' => 'Small groups and spiritual growth ministries'],
            ['name' => 'Worship & Arts', 'slug' => 'worship-arts', 'description' => 'Worship, music, and creative arts ministries'],
        ];

        foreach ($ministryCategories as $category) {
            MinistryCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        $this->command->info('Categories seeded successfully.');
    }
}
