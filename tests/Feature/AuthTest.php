<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = $this->createUserWithRole(Role::ADMIN);

        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = $this->createUserWithRole(Role::ADMIN);

        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'totally-wrong',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_fails_with_inactive_account(): void
    {
        $role = Role::where('name', Role::EDITOR)->first();
        $user = User::factory()->create([
            'first_name' => 'Inactive',
            'last_name'  => 'User',
            'role_id'    => $role->id,
            'status'     => 'inactive',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_validation_requires_email_and_password(): void
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = $this->createUserWithRole(Role::ADMIN);

        $response = $this->withHeaders($this->authHeaders($user))
                         ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_request_to_admin_route_returns_401(): void
    {
        $this->getJson('/api/v1/admin/blogs')->assertStatus(401);
    }

    public function test_authenticated_user_can_get_own_profile(): void
    {
        $user = $this->createUserWithRole(Role::ADMIN);

        $response = $this->withHeaders($this->authHeaders($user))
                         ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
                 ->assertJsonPath('data.email', $user->email);
    }
}
