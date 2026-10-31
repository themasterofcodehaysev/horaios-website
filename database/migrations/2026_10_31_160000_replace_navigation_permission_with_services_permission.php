<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if navigation.manage exists
        $navPerm = DB::table('permissions')->where('name', 'navigation.manage')->first();

        if ($navPerm) {
            DB::table('permissions')
                ->where('id', $navPerm->id)
                ->update([
                    'name'         => 'services.manage',
                    'display_name' => 'Manage Service Page',
                    'group'        => 'services',
                    'description'  => 'Manage church service schedules and details',
                    'updated_at'   => now(),
                ]);
        } else {
            // If it does not exist, insert services.manage
            $permId = DB::table('permissions')->insertGetId([
                'name'         => 'services.manage',
                'display_name' => 'Manage Service Page',
                'group'        => 'services',
                'description'  => 'Manage church service schedules and details',
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);

            // Assign to admin and super admin roles
            $adminRoles = DB::table('roles')->whereIn('name', ['super_admin', 'admin', 'editor'])->get();
            foreach ($adminRoles as $role) {
                DB::table('role_permission')->updateOrInsert(
                    ['role_id' => $role->id, 'permission_id' => $permId]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')
            ->where('name', 'services.manage')
            ->update([
                'name'         => 'navigation.manage',
                'display_name' => 'Manage Navigation',
                'group'        => 'navigation',
                'description'  => 'Manage navigation menus and items',
                'updated_at'   => now(),
            ]);
    }
};
