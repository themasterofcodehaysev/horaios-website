<?php

namespace Database\Seeders;

use App\Models\Leader;
use Illuminate\Database\Seeder;

class LeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaders = [
            [
                'name'          => 'Rev. Jinhlawng Lalduhawma',
                'role'          => 'Founder, Consultant & Adviser',
                'bio'           => 'Indian missionary sent from the Baptist Church of Mizoram who arrived in Phnom Penh in December 2013. Initiated the student dormitory ministry and founded Horaios Baptist Church in October 2015.',
                'photo'         => null,
                'email'         => 'lalduhawma@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 120',
                'facebook'      => 'https://www.facebook.com/profile.php?id=61583373172735',
                'display_order' => 1,
                'status'        => 'active',
            ],
            [
                'name'          => 'Mr. Chin Than',
                'role'          => 'Pastor & Hostel Warden',
                'bio'           => 'Serving as pastor and student dormitory warden since the church foundation in October 2015. Passionate about pastoral care, discipleship, and guiding young students in Christ.',
                'photo'         => null,
                'email'         => 'chinthan@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 121',
                'facebook'      => 'https://www.facebook.com/profile.php?id=61583373172735',
                'display_order' => 2,
                'status'        => 'active',
            ],
            [
                'name'          => 'Mrs. Sok Chakreya',
                'role'          => 'Church Secretary',
                'bio'           => 'Overseeing church administrative affairs, assembly minutes, membership records, and coordinating weekly ministry operations with pastoral leadership.',
                'photo'         => null,
                'email'         => 'secretary@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 122',
                'facebook'      => 'https://www.facebook.com/profile.php?id=61583373172735',
                'display_order' => 3,
                'status'        => 'active',
            ],
            [
                'name'          => 'San Sophy',
                'role'          => 'Women Department Coordinator',
                'bio'           => 'Leading the women’s fellowship, weekly prayer gatherings, discipleship groups, and benevolent outreach for sisters and families across the church.',
                'photo'         => null,
                'email'         => 'women@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 123',
                'facebook'      => null,
                'display_order' => 4,
                'status'        => 'active',
            ],
            [
                'name'          => 'Mrs. Khiangte Lalrengpuii',
                'role'          => 'Children Ministry Coordinator',
                'bio'           => 'Directing Sunday School, creative Bible teaching, and children’s activities to ensure a loving, joyful, and safe Christ-centered environment for young hearts.',
                'photo'         => null,
                'email'         => 'children@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 124',
                'facebook'      => null,
                'display_order' => 5,
                'status'        => 'active',
            ],
        ];

        // Clean out any old dummy generic entries if they exist
        Leader::whereIn('name', [
            'Senior Pastor', 
            'Associate Pastor', 
            'Worship & Youth Director',
            'Pastor John Smith',
            'Pastor David Lee',
            'Pastor Sarah Johnson',
            'Michael Williams',
            'Sokha Chan',
            'Mary Brown',
            'Dr. Robert Taylor',
            'Dara Heng'
        ])->delete();

        foreach ($leaders as $leaderData) {
            Leader::updateOrCreate(
                ['name' => $leaderData['name']],
                $leaderData
            );
        }
    }
}
