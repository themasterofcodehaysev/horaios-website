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
                'name'          => 'Senior Pastor',
                'role'          => 'Senior Pastor',
                'bio'           => 'Leading the congregation in biblical teaching, vision casting, and pastoral oversight.',
                'photo'         => null,
                'email'         => 'pastor@horaiosbaptist.org',
                'phone'         => null,
                'facebook'      => null,
                'display_order' => 1,
                'status'        => 'active',
            ],
            [
                'name'          => 'Associate Pastor',
                'role'          => 'Discipleship & Outreach',
                'bio'           => 'Passionate about equipping believers for discipleship, evangelism, and community care.',
                'photo'         => null,
                'email'         => null,
                'phone'         => null,
                'facebook'      => null,
                'display_order' => 2,
                'status'        => 'active',
            ],
            [
                'name'          => 'Worship & Youth Director',
                'role'          => 'Worship & NextGen',
                'bio'           => 'Guiding the congregation in heartfelt praise and mentoring the next generation in faith.',
                'photo'         => null,
                'email'         => null,
                'phone'         => null,
                'facebook'      => null,
                'display_order' => 3,
                'status'        => 'active',
            ],
        ];

        foreach ($leaders as $leaderData) {
            Leader::firstOrCreate(
                ['role' => $leaderData['role']],
                $leaderData
            );
        }
    }
}
