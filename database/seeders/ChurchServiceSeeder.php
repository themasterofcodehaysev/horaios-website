<?php

namespace Database\Seeders;

use App\Models\ChurchService;
use Illuminate\Database\Seeder;

class ChurchServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title'         => 'Main Sunday Worship',
                'day'           => 'Sunday Morning',
                'time'          => '9:00 AM & 11:00 AM',
                'type'          => 'Main Worship Service',
                'location'      => 'Main Sanctuary & Live Stream',
                'description'   => 'Join our main corporate worship service in English and Khmer with communal prayer, choral praise, and biblical preaching.',
                'icon'          => '<i class="fa-solid fa-church"></i>',
                'display_order' => 1,
                'status'        => 'active',
            ],
            [
                'title'         => 'Mid-Week Prayer & Bible Study',
                'day'           => 'Wednesday Evening',
                'time'          => '7:00 PM - 8:30 PM',
                'type'          => 'Prayer & Discipleship',
                'location'      => 'Fellowship Hall & Zoom',
                'description'   => 'Gathering for heartfelt intercession, pastoral prayer, and in-depth verse-by-verse scripture study.',
                'icon'          => '<i class="fa-solid fa-hands-praying"></i>',
                'display_order' => 2,
                'status'        => 'active',
            ],
            [
                'title'         => 'Youth Fellowship & Worship',
                'day'           => 'Saturday Afternoon',
                'time'          => '2:30 PM - 4:30 PM',
                'type'          => 'Youth & Students',
                'location'      => 'Youth Hall (3rd Floor)',
                'description'   => 'Vibrant high-energy worship, relevant teaching, small group discussions, and encouraging Christian fellowship for students.',
                'icon'          => '<i class="fa-solid fa-users"></i>',
                'display_order' => 3,
                'status'        => 'active',
            ],
        ];

        foreach ($services as $data) {
            ChurchService::updateOrCreate(
                ['title' => $data['title'], 'day' => $data['day']],
                $data
            );
        }
    }
}
