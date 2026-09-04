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
            ['name' => 'Church News', 'description' => 'Updates and announcements from our church community'],
            ['name' => 'Sermon Series', 'description' => 'Resources and insights from our current sermon series'],
            ['name' => 'Community Stories', 'description' => 'Stories of transformation and testimonies from our members'],
            ['name' => 'Events & Activities', 'description' => 'Highlights from church events and community activities'],
        ];

        foreach ($blogCategories as $category) {
            BlogCategory::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }

        // Event Categories
        $eventCategories = [
            ['name' => 'Worship Services', 'description' => 'Regular and special worship services'],
            ['name' => 'Small Groups', 'description' => 'Bible studies and small group gatherings'],
            ['name' => 'Outreach Events', 'description' => 'Community outreach and service events'],
            ['name' => 'Youth & Kids', 'description' => 'Events for children and youth'],
            ['name' => 'Special Events', 'description' => 'Conferences, retreats, and special celebrations'],
        ];

        foreach ($eventCategories as $category) {
            EventCategory::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }

        // Ministry Categories
        $ministryCategories = [
            ['name' => 'Ministry Teams', 'description' => 'Ongoing ministry teams and service groups'],
            ['name' => 'Outreach', 'description' => 'Community outreach and service ministries'],
            ['name' => 'Discipleship', 'description' => 'Small groups and spiritual growth ministries'],
            ['name' => 'Worship & Arts', 'description' => 'Worship, music, and creative arts ministries'],
        ];

        foreach ($ministryCategories as $category) {
            MinistryCategory::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }

        $this->command->info('Categories seeded successfully.');
    }
}
