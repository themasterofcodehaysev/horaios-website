<?php

namespace Tests\Feature;

use App\Models\Leader;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class LeaderApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_public_can_list_active_leaders(): void
    {
        Leader::create([
            'name'          => 'Pastor Alpha',
            'role'          => 'Senior Pastor',
            'status'        => 'active',
            'display_order' => 1,
        ]);

        Leader::create([
            'name'          => 'Pastor Beta',
            'role'          => 'Youth Pastor',
            'status'        => 'inactive',
            'display_order' => 2,
        ]);

        $response = $this->getJson('/api/v1/leaders');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Pastor Alpha');
    }

    public function test_admin_can_list_all_leaders(): void
    {
        Leader::create(['name' => 'Pastor Alpha', 'role' => 'Lead', 'status' => 'active', 'display_order' => 1]);
        Leader::create(['name' => 'Pastor Beta', 'role' => 'Youth', 'status' => 'inactive', 'display_order' => 2]);

        $admin = $this->createUserWithRole(Role::SUPER_ADMIN);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/leaders');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_leader(): void
    {
        $admin = $this->createUserWithRole(Role::SUPER_ADMIN);

        $payload = [
            'name'          => 'Pastor Tim',
            'role'          => 'Campus Pastor',
            'bio'           => 'Loves serving youth and families.',
            'photo'         => '/storage/uploads/leaders/tim.jpg',
            'email'         => 'tim@horaios.org',
            'display_order' => 5,
            'status'        => 'active',
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/leaders', $payload);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Pastor Tim');

        $this->assertDatabaseHas('leaders', ['name' => 'Pastor Tim', 'role' => 'Campus Pastor']);
    }

    public function test_admin_can_update_leader(): void
    {
        $admin = $this->createUserWithRole(Role::SUPER_ADMIN);

        $leader = Leader::create([
            'name'          => 'Pastor John',
            'role'          => 'Senior Pastor',
            'status'        => 'active',
            'display_order' => 1,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/admin/leaders/{$leader->id}", [
                'name' => 'Dr. John Doe',
                'role' => 'Senior Pastor Emeritus',
            ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Dr. John Doe');

        $this->assertDatabaseHas('leaders', ['id' => $leader->id, 'name' => 'Dr. John Doe']);
    }

    public function test_admin_can_delete_leader(): void
    {
        $admin = $this->createUserWithRole(Role::SUPER_ADMIN);

        $leader = Leader::create([
            'name'          => 'Pastor To Delete',
            'role'          => 'Interim',
            'status'        => 'active',
            'display_order' => 9,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/leaders/{$leader->id}");

        $response->assertOk()
            ->assertJsonPath('success', true);
        $this->assertDatabaseMissing('leaders', ['id' => $leader->id]);
    }

    public function test_admin_can_toggle_leader_status(): void
    {
        $admin = $this->createUserWithRole(Role::SUPER_ADMIN);

        $leader = Leader::create([
            'name'          => 'Leader One',
            'role'          => 'Elder',
            'status'        => 'active',
            'display_order' => 1,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/leaders/{$leader->id}/status");

        $response->assertOk()
            ->assertJsonPath('data.status', 'inactive');

        $this->assertDatabaseHas('leaders', ['id' => $leader->id, 'status' => 'inactive']);
    }

    public function test_admin_can_reorder_leaders(): void
    {
        $admin = $this->createUserWithRole(Role::SUPER_ADMIN);

        $l1 = Leader::create(['name' => 'L1', 'role' => 'R1', 'display_order' => 10]);
        $l2 = Leader::create(['name' => 'L2', 'role' => 'R2', 'display_order' => 20]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/leaders/reorder', [
                'orders' => [
                    ['id' => $l1->id, 'display_order' => 1],
                    ['id' => $l2->id, 'display_order' => 2],
                ],
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('leaders', ['id' => $l1->id, 'display_order' => 1]);
        $this->assertDatabaseHas('leaders', ['id' => $l2->id, 'display_order' => 2]);
    }

    public function test_unauthenticated_cannot_create_leader(): void
    {
        $response = $this->postJson('/api/v1/admin/leaders', [
            'name' => 'Unauthorized Leader',
            'role' => 'Guest',
        ]);

        $response->assertUnauthorized();
    }
}
