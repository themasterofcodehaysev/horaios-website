<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Define permissions
        $permissions = [
            // User management
            ['name' => 'users.view', 'display_name' => 'View Users', 'group' => 'users'],
            ['name' => 'users.create', 'display_name' => 'Create Users', 'group' => 'users'],
            ['name' => 'users.edit', 'display_name' => 'Edit Users', 'group' => 'users'],
            ['name' => 'users.delete', 'display_name' => 'Delete Users', 'group' => 'users'],

            // Future content management modules
            ['name' => 'songs.manage', 'display_name' => 'Manage Songs', 'group' => 'content'],
            ['name' => 'sermons.manage', 'display_name' => 'Manage Sermons', 'group' => 'content'],
            ['name' => 'events.manage', 'display_name' => 'Manage Events', 'group' => 'content'],
            ['name' => 'ministries.manage', 'display_name' => 'Manage Ministries', 'group' => 'content'],
            ['name' => 'blog.manage', 'display_name' => 'Manage Blog', 'group' => 'content'],

            // Foundation management
            ['name' => 'media.manage', 'display_name' => 'Manage Media', 'group' => 'media'],
            ['name' => 'settings.manage', 'display_name' => 'Manage Settings', 'group' => 'settings'],
            ['name' => 'audit.view', 'display_name' => 'View Audit Logs', 'group' => 'audit'],
        ];

        $permissionModels = [];
        foreach ($permissions as $p) {
            $permissionModels[$p['name']] = Permission::firstOrCreate(
                ['name' => $p['name']],
                $p
            );
        }

        // Roles
        $superAdminRole = Role::firstOrCreate(
            ['name' => Role::SUPER_ADMIN],
            ['display_name' => 'Super Administrator', 'description' => 'Full system access and configuration.']
        );

        $adminRole = Role::firstOrCreate(
            ['name' => Role::ADMIN],
            ['display_name' => 'Administrator', 'description' => 'Full CMS content management access.']
        );

        $editorRole = Role::firstOrCreate(
            ['name' => Role::EDITOR],
            ['display_name' => 'Editor', 'description' => 'Content management only.']
        );

        // Assign permissions to Admin & Editor.
        // Per spec, ADMIN covers Dashboard, Content, and Settings — but not user
        // management, which is reserved for SUPER_ADMIN.
        $adminPermissions = Permission::where('group', '!=', 'users')->get();
        $adminRole->permissions()->sync($adminPermissions->pluck('id'));

        $editorPermissions = Permission::whereIn('group', ['content', 'media'])->get();
        $editorRole->permissions()->sync($editorPermissions->pluck('id'));

        // Assign all permissions to Super Admin
        $allPermissions = Permission::all();
        $superAdminRole->permissions()->sync($allPermissions->pluck('id'));

        // Default Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@horaiosbaptist.org'],
            [
                'uuid' => (string) Str::uuid(),
                'first_name' => 'Horaios',
                'last_name' => 'Admin',
                'display_name' => 'Horaios Super Admin',
                'phone' => '+85523000000',
                'password' => Hash::make('Password@123'),
                'role_id' => $superAdminRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}
