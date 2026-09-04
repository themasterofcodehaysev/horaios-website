<?php

namespace Tests\Feature;

use App\Models\Ministry;
use App\Models\MinistryCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class MinistryApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_public_can_list_published_ministries(): void
    {
        Ministry::factory()->count(3)->create(['status' => 'published', 'published_at' => now()]);
        Ministry::factory()->create(['status' => 'draft']);

        $response = $this->getJson('/api/v1/ministries');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_can_view_ministry_by_id(): void
    {
        $ministry = Ministry::factory()->create(['status' => 'published', 'published_at' => now()]);

        $response = $this->getJson("/api/v1/ministries/{$ministry->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $ministry->id);
    }

    public function test_admin_can_create_ministry(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/ministries', [
            'name'        => 'Youth Ministry',
            'description' => 'A vibrant ministry for youth and students.',
            'status'      => 'draft',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Youth Ministry');

        $this->assertDatabaseHas('ministries', ['name' => 'Youth Ministry']);
    }

    public function test_admin_can_update_ministry(): void
    {
        $ministry = Ministry::factory()->create(['name' => 'Old Name']);
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/ministries/{$ministry->id}", [
            'name'   => 'New Name',
            'status' => 'draft',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'New Name');
    }

    public function test_admin_can_delete_ministry(): void
    {
        $ministry = Ministry::factory()->create();
        $headers  = $this->superAdminHeaders();

        $this->withHeaders($headers)->deleteJson("/api/v1/admin/ministries/{$ministry->id}")
             ->assertStatus(200);

        $this->assertSoftDeleted('ministries', ['id' => $ministry->id]);
    }

    public function test_admin_can_view_draft_ministry_via_admin_show(): void
    {
        $ministry = Ministry::factory()->create(['status' => 'draft']);
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->getJson("/api/v1/admin/ministries/{$ministry->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $ministry->id)
                 ->assertJsonPath('data.status', 'draft');
    }
}
