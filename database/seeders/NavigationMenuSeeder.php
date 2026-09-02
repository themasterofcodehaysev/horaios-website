<?php

namespace Database\Seeders;

use App\Models\NavigationMenu;
use App\Models\NavigationMenuItem;
use Illuminate\Database\Seeder;

class NavigationMenuSeeder extends Seeder
{
    public function run(): void
    {
        // Create Header Navigation Menu
        $headerMenu = NavigationMenu::firstOrCreate(
            ['slug' => 'main-header'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Main Header Navigation',
                'location' => 'header',
                'description' => 'Main navigation menu for the website header',
                'is_active' => true,
                'display_order' => 1,
            ]
        );

        // Add default header menu items
        $headerItems = [
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Home',
                'url' => '/',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 1,
                'icon' => 'Home',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'About Us',
                'url' => '/about',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 2,
                'icon' => 'Info',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Sermons',
                'url' => '/sermons',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 3,
                'icon' => 'PlayCircle',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Events',
                'url' => '/events',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 4,
                'icon' => 'Calendar',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Ministries',
                'url' => '/ministries',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 5,
                'icon' => 'Users',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Blog',
                'url' => '/blog',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 6,
                'icon' => 'FileText',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Prayer',
                'url' => '/prayer',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 7,
                'icon' => 'Heart',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $headerMenu->id,
                'parent_id' => null,
                'label' => 'Contact',
                'url' => '/contact',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 8,
                'icon' => 'Mail',
            ],
        ];

        foreach ($headerItems as $item) {
            NavigationMenuItem::firstOrCreate(
                ['uuid' => $item['uuid']],
                $item
            );
        }

        // Create Footer Navigation Menu
        $footerMenu = NavigationMenu::firstOrCreate(
            ['slug' => 'main-footer'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Main Footer Navigation',
                'location' => 'footer',
                'description' => 'Main navigation menu for the website footer',
                'is_active' => true,
                'display_order' => 1,
            ]
        );

        // Add default footer menu items
        $footerItems = [
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $footerMenu->id,
                'parent_id' => null,
                'label' => 'Home',
                'url' => '/',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 1,
                'icon' => null,
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $footerMenu->id,
                'parent_id' => null,
                'label' => 'About Us',
                'url' => '/about',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 2,
                'icon' => null,
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $footerMenu->id,
                'parent_id' => null,
                'label' => 'Sermons',
                'url' => '/sermons',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 3,
                'icon' => null,
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $footerMenu->id,
                'parent_id' => null,
                'label' => 'Events',
                'url' => '/events',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 4,
                'icon' => null,
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $footerMenu->id,
                'parent_id' => null,
                'label' => 'Contact',
                'url' => '/contact',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 5,
                'icon' => null,
            ],
        ];

        foreach ($footerItems as $item) {
            NavigationMenuItem::firstOrCreate(
                ['uuid' => $item['uuid']],
                $item
            );
        }

        // Create Quick Links Menu
        $quickLinksMenu = NavigationMenu::firstOrCreate(
            ['slug' => 'quick-links'],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Quick Links',
                'location' => 'quick_links',
                'description' => 'Quick links for easy access to important pages',
                'is_active' => true,
                'display_order' => 1,
            ]
        );

        // Add default quick links items
        $quickLinksItems = [
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $quickLinksMenu->id,
                'parent_id' => null,
                'label' => 'Give Online',
                'url' => '/give',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 1,
                'icon' => 'Heart',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $quickLinksMenu->id,
                'parent_id' => null,
                'label' => 'Visit Us',
                'url' => '/visit',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 2,
                'icon' => 'MapPin',
            ],
            [
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'menu_id' => $quickLinksMenu->id,
                'parent_id' => null,
                'label' => 'Songs',
                'url' => '/songs',
                'is_external' => false,
                'open_in_new_tab' => false,
                'is_active' => true,
                'display_order' => 3,
                'icon' => 'Music',
            ],
        ];

        foreach ($quickLinksItems as $item) {
            NavigationMenuItem::firstOrCreate(
                ['uuid' => $item['uuid']],
                $item
            );
        }

        $this->command->info('Navigation menus seeded successfully.');
    }
}