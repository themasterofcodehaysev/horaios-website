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
                'name'          => 'Pastor John Smith',
                'role'          => 'Senior Pastor',
                'bio'           => 'Serving as Senior Pastor with over 20 years of gospel ministry and church planting in Southeast Asia. Passionate about expository preaching and pastoral mentorship.',
                'photo'         => null,
                'email'         => 'pastor.john@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 123',
                'facebook'      => 'https://facebook.com/horaiosbaptist',
                'display_order' => 1,
                'status'        => 'active',
            ],
            [
                'name'          => 'Pastor David Lee',
                'role'          => 'Associate Pastor & Discipleship',
                'bio'           => 'Overseeing adult discipleship, small groups, and community outreach across Phnom Penh. Dedicated to training believers in faithful Bible study.',
                'photo'         => null,
                'email'         => 'david.lee@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 124',
                'facebook'      => 'https://facebook.com/horaiosbaptist',
                'display_order' => 2,
                'status'        => 'active',
            ],
            [
                'name'          => 'Pastor Sarah Johnson',
                'role'          => 'Youth & NextGen Pastor',
                'bio'           => 'Guiding next-generation discipleship, campus ministry, and youth leadership development with vibrant gospel energy and pastoral care.',
                'photo'         => null,
                'email'         => 'sarah.j@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 125',
                'facebook'      => null,
                'display_order' => 3,
                'status'        => 'active',
            ],
            [
                'name'          => 'Michael Williams',
                'role'          => 'Worship & Creative Arts Director',
                'bio'           => 'Directing Sunday worship, musical ensembles, and audiovisual technology, cultivating a reverent and Christ-exalting atmosphere for worship.',
                'photo'         => null,
                'email'         => 'worship@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 126',
                'facebook'      => null,
                'display_order' => 4,
                'status'        => 'active',
            ],
            [
                'name'          => 'Sokha Chan',
                'role'          => 'Khmer Community & Outreach Director',
                'bio'           => 'Coordinating local outreach, benevolent ministry, and community engagement in Boeung Keng Kang 3 and surrounding Phnom Penh communities.',
                'photo'         => null,
                'email'         => 'sokha.chan@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 127',
                'facebook'      => null,
                'display_order' => 5,
                'status'        => 'active',
            ],
            [
                'name'          => 'Mary Brown',
                'role'          => "Children's Ministry Director",
                'bio'           => 'Leading Sunday School, VBS, and volunteer training to ensure a safe, joyful, and Christ-centered environment for children and young families.',
                'photo'         => null,
                'email'         => 'children@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 128',
                'facebook'      => null,
                'display_order' => 6,
                'status'        => 'active',
            ],
            [
                'name'          => 'Dr. Robert Taylor',
                'role'          => 'Missions & Global Partnerships',
                'bio'           => 'Facilitating cross-cultural partnerships, regional church strengthening, and missionary support throughout Cambodia and Southeast Asia.',
                'photo'         => null,
                'email'         => 'missions@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 129',
                'facebook'      => null,
                'display_order' => 7,
                'status'        => 'active',
            ],
            [
                'name'          => 'Dara Heng',
                'role'          => 'Church Administrator & Operations',
                'bio'           => 'Managing church facilities, stewardship administration, communications, and member care logistics to support weekly ministry operations.',
                'photo'         => null,
                'email'         => 'admin@horaiosbaptist.org',
                'phone'         => '+855 (0) 23 880 130',
                'facebook'      => null,
                'display_order' => 8,
                'status'        => 'active',
            ],
        ];

        // Clean out any old dummy generic entries if they exist
        Leader::whereIn('name', ['Senior Pastor', 'Associate Pastor', 'Worship & Youth Director'])->delete();

        foreach ($leaders as $leaderData) {
            Leader::updateOrCreate(
                ['name' => $leaderData['name']],
                $leaderData
            );
        }
    }
}
