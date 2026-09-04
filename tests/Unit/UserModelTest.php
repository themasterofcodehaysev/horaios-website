<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_user_generates_uuid_and_display_name_automatically(): void
    {
        $user = User::factory()->create([
            'first_name'   => 'Grace',
            'last_name'    => 'Hopper',
            'display_name' => '',
        ]);

        $this->assertNotEmpty($user->uuid);
        $this->assertEquals('Grace Hopper', $user->display_name);
    }

    public function test_user_role_helpers(): void
    {
        $adminRole = Role::where('name', Role::ADMIN)->first();
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $this->assertTrue($user->isAdmin());
        $this->assertTrue($user->isEditor());
        $this->assertFalse($user->isSuperAdmin());
    }

    public function test_super_admin_has_all_permissions(): void
    {
        $superRole = Role::where('name', Role::SUPER_ADMIN)->first();
        $user = User::factory()->create(['role_id' => $superRole->id]);

        $this->assertTrue($user->isSuperAdmin());
        $this->assertTrue($user->hasPermission('any.random.permission'));
    }

    public function test_user_service_updates_display_name_explicitly(): void
    {
        $userService = app(\App\Services\UserService::class);
        $user = User::factory()->create([
            'first_name'   => 'John',
            'last_name'    => 'Doe',
            'display_name' => 'John Doe',
        ]);

        $updated = $userService->updateUser($user, [
            'display_name' => 'Pastor John',
        ]);

        $this->assertEquals('Pastor John', $updated->display_name);
    }

    public function test_user_service_recalculates_display_name_when_names_change_without_explicit_display_name(): void
    {
        $userService = app(\App\Services\UserService::class);
        $user = User::factory()->create([
            'first_name'   => 'John',
            'last_name'    => 'Doe',
            'display_name' => 'John Doe',
        ]);

        $updated = $userService->updateUser($user, [
            'first_name' => 'Johnny',
            'last_name'  => 'Smith',
        ]);

        $this->assertEquals('Johnny Smith', $updated->display_name);
    }

    public function test_user_service_syncs_display_name_when_submitted_matches_old_full_name(): void
    {
        $userService = app(\App\Services\UserService::class);
        $user = User::factory()->create([
            'first_name'   => 'hay',
            'last_name'    => 'sev',
            'display_name' => 'hay sev',
        ]);

        $updated = $userService->updateUser($user, [
            'first_name'   => 'haysev',
            'last_name'    => 'admin',
            'display_name' => 'hay sev', // Old display name submitted from form
        ]);

        $this->assertEquals('haysev admin', $updated->display_name);
    }

    public function test_user_service_recalculates_display_name_when_empty_string_provided(): void
    {
        $userService = app(\App\Services\UserService::class);
        $user = User::factory()->create([
            'first_name'   => 'Hay',
            'last_name'    => 'Sev',
            'display_name' => 'Custom Nickname',
        ]);

        $updated = $userService->updateUser($user, [
            'display_name' => '',
        ]);

        $this->assertEquals('Hay Sev', $updated->display_name);
    }

    public function test_user_service_preserves_custom_nickname_when_names_change(): void
    {
        $userService = app(\App\Services\UserService::class);
        $user = User::factory()->create([
            'first_name'   => 'Hay',
            'last_name'    => 'Sev',
            'display_name' => 'Custom Nickname',
        ]);

        $updated = $userService->updateUser($user, [
            'first_name'   => 'Hayden',
            'display_name' => 'Custom Nickname',
        ]);

        $this->assertEquals('Custom Nickname', $updated->display_name);
    }
}
