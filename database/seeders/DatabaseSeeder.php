<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            ChurchSettingsSeeder::class,
            CategorySeeder::class,
            BlogPostSeeder::class,
            EventSeeder::class,
            MinistrySeeder::class,
            SongSeeder::class,
            SermonSeeder::class,
            NavigationMenuSeeder::class,
        ]);
    }
}
