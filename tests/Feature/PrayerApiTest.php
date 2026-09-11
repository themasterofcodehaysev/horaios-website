<?php

namespace Tests\Feature;

use App\Models\PrayerRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class PrayerApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    // -------------------------------------------------------------------------
    // Public endpoints
    // -------------------------------------------------------------------------

    public function test_public_can_submit_prayer_request(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '012345678',
            'title' => 'Healing for Family',
            'request' => 'Please pray for my mother who is recovering in the hospital.',
            'request_type' => 'healing',
            'urgency' => 'high',
            'allow_public_prayer' => true,
            'is_anonymous' => false,
        ];

        $response = $this->postJson('/api/v1/prayer-requests', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Healing for Family')
                 ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('prayer_requests', [
            'title' => 'Healing for Family',
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'request_type' => 'healing',
            'urgency' => 'high',
            'allow_public_prayer' => 1,
            'status' => 'pending',
        ]);
    }

    public function test_prayer_submission_requires_mandatory_fields(): void
    {
        $response = $this->postJson('/api/v1/prayer-requests', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'title', 'request']);
    }

    public function test_public_can_list_public_prayer_requests(): void
    {
        PrayerRequest::factory()->create([
            'allow_public_prayer' => true,
            'status' => 'reviewed',
        ]);
        PrayerRequest::factory()->create([
            'allow_public_prayer' => true,
            'status' => 'pending', // pending not shown publicly
        ]);
        PrayerRequest::factory()->create([
            'allow_public_prayer' => false,
            'status' => 'reviewed',
        ]);

        $response = $this->getJson('/api/v1/prayer-requests');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    // -------------------------------------------------------------------------
    // Admin endpoints
    // -------------------------------------------------------------------------

    public function test_admin_can_list_all_prayer_requests(): void
    {
        PrayerRequest::factory()->count(3)->create();
        $admin = $this->createUserWithRole(\App\Models\Role::SUPER_ADMIN);

        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson('/api/v1/admin/prayer-requests');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'meta']);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_admin_can_update_prayer_status(): void
    {
        $prayer = PrayerRequest::factory()->create(['status' => 'pending']);
        $admin = $this->createUserWithRole(\App\Models\Role::SUPER_ADMIN);

        $response = $this->actingAs($admin, 'sanctum')
                         ->patchJson("/api/v1/admin/prayer-requests/{$prayer->id}/status", [
                             'status' => 'praying',
                         ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'praying');

        $this->assertDatabaseHas('prayer_requests', [
            'id' => $prayer->id,
            'status' => 'praying',
        ]);
    }

    public function test_admin_can_delete_prayer_request(): void
    {
        $prayer = PrayerRequest::factory()->create();
        $admin = $this->createUserWithRole(\App\Models\Role::SUPER_ADMIN);

        $response = $this->actingAs($admin, 'sanctum')
                         ->deleteJson("/api/v1/admin/prayer-requests/{$prayer->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('prayer_requests', ['id' => $prayer->id]);
    }
}
