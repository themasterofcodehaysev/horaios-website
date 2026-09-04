<?php

namespace Tests\Feature\Traits;

use App\Models\Role;
use App\Models\User;

trait CreatesAdminUser
{
    /** Create a user with the given role and return it with an auth token. */
    protected function createUserWithRole(string $roleName = Role::SUPER_ADMIN): User
    {
        $role = Role::firstOrCreate(
            ['name' => $roleName],
            ['display_name' => $roleName, 'description' => $roleName]
        );

        return User::factory()->create([
            'first_name' => 'Test',
            'last_name'  => 'User',
            'role_id'    => $role->id,
            'status'     => 'active',
        ]);
    }

    /** Return an Authorization header for the given user. */
    protected function authHeaders(User $user): array
    {
        $token = $user->createToken('test-token')->plainTextToken;

        return ['Authorization' => "Bearer {$token}"];
    }

    /** Shortcut: create a super-admin and return its auth headers. */
    protected function superAdminHeaders(): array
    {
        $user = $this->createUserWithRole(Role::SUPER_ADMIN);
        return $this->authHeaders($user);
    }
}
