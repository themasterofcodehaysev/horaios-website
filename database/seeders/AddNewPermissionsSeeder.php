<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AddNewPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $newPermissions = [
            // Prayer Requests
            ['name' => 'prayer_requests.view', 'display_name' => 'View Prayer Requests', 'group' => 'prayer_requests', 'description' => 'View prayer requests list and details'],
            ['name' => 'prayer_requests.create', 'display_name' => 'Create Prayer Requests', 'group' => 'prayer_requests', 'description' => 'Create new prayer requests'],
            ['name' => 'prayer_requests.edit', 'display_name' => 'Edit Prayer Requests', 'group' => 'prayer_requests', 'description' => 'Edit prayer requests'],
            ['name' => 'prayer_requests.delete', 'display_name' => 'Delete Prayer Requests', 'group' => 'prayer_requests', 'description' => 'Delete prayer requests'],
            
            // Contact Messages
            ['name' => 'contact_messages.view', 'display_name' => 'View Contact Messages', 'group' => 'contact_messages', 'description' => 'View contact messages list and details'],
            ['name' => 'contact_messages.create', 'display_name' => 'Create Contact Messages', 'group' => 'contact_messages', 'description' => 'Create new contact messages'],
            ['name' => 'contact_messages.edit', 'display_name' => 'Edit Contact Messages', 'group' => 'contact_messages', 'description' => 'Edit contact messages'],
            ['name' => 'contact_messages.delete', 'display_name' => 'Delete Contact Messages', 'group' => 'contact_messages', 'description' => 'Delete contact messages'],
            
            // Media
            ['name' => 'media.view', 'display_name' => 'View Media', 'group' => 'media', 'description' => 'View media library'],
            ['name' => 'media.upload', 'display_name' => 'Upload Media', 'group' => 'media', 'description' => 'Upload new media files'],
            ['name' => 'media.edit', 'display_name' => 'Edit Media', 'group' => 'media', 'description' => 'Edit media metadata'],
            ['name' => 'media.delete', 'display_name' => 'Delete Media', 'group' => 'media', 'description' => 'Delete media files'],
            
            // Homepage
            ['name' => 'homepage.manage', 'display_name' => 'Manage Homepage', 'group' => 'homepage', 'description' => 'Manage homepage sections and content'],
            
            // Navigation
            ['name' => 'navigation.manage', 'display_name' => 'Manage Navigation', 'group' => 'navigation', 'description' => 'Manage navigation menus and items'],
            
            // Footer
            ['name' => 'footer.manage', 'display_name' => 'Manage Footer', 'group' => 'footer', 'description' => 'Manage footer content and settings'],
        ];

        foreach ($newPermissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permission['name']],
                [
                    'display_name' => $permission['display_name'],
                    'group' => $permission['group'],
                    'description' => $permission['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Assign permissions to admin role
        $adminRole = DB::table('roles')->where('name', Role::ADMIN)->first();
        if ($adminRole) {
            foreach ($newPermissions as $permission) {
                $perm = DB::table('permissions')->where('name', $permission['name'])->first();
                if ($perm) {
                    DB::table('role_permission')->updateOrInsert(
                        ['role_id' => $adminRole->id, 'permission_id' => $perm->id]
                    );
                }
            }
        }

        // Assign permissions to editor role (view and edit only)
        $editorRole = DB::table('roles')->where('name', Role::EDITOR)->first();
        if ($editorRole) {
            $editorPermissions = [
                'prayer_requests.view', 'prayer_requests.edit',
                'contact_messages.view', 'contact_messages.edit',
                'media.view', 'media.upload', 'media.edit',
                'homepage.manage',
                'navigation.manage',
                'footer.manage',
            ];
            
            foreach ($editorPermissions as $permName) {
                $perm = DB::table('permissions')->where('name', $permName)->first();
                if ($perm) {
                    DB::table('role_permission')->updateOrInsert(
                        ['role_id' => $editorRole->id, 'permission_id' => $perm->id]
                    );
                }
            }
        }
    }
}
