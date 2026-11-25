<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class PageImagesSettingsTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_admin_can_save_page_images_and_public_endpoint_returns_them(): void
    {
        $this->putJson('/api/v1/settings/church', [
            'settings' => [
                'home_fellowship_image' => '/storage/uploads/pages/2026/11/home.jpg',
                'about_building_image'  => '/storage/uploads/pages/2026/11/about.jpg',
            ],
        ], $this->superAdminHeaders())->assertOk();

        $this->getJson('/api/v1/settings/church/public')
            ->assertOk()
            ->assertJsonPath('data.page_images.home_fellowship_image', '/storage/uploads/pages/2026/11/home.jpg')
            ->assertJsonPath('data.page_images.about_building_image', '/storage/uploads/pages/2026/11/about.jpg');
    }

    public function test_guest_cannot_change_page_images(): void
    {
        $this->putJson('/api/v1/settings/church', [
            'settings' => ['home_fellowship_image' => '/evil.jpg'],
        ])->assertUnauthorized();
    }
}
