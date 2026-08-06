<?php

namespace App\Http\Controllers\Api;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class RoleController extends BaseApiController
{
    /**
     * GET /api/v1/roles
     * List all roles with their permissions.
     */
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->withCount('users')->get();

        return $this->success($roles->map(fn($r) => [
            'id'           => $r->id,
            'name'         => $r->name,
            'display_name' => $r->display_name,
            'description'  => $r->description,
            'users_count'  => $r->users_count,
            'is_system'    => in_array($r->name, [Role::SUPER_ADMIN, Role::ADMIN, Role::EDITOR]),
            'permissions'  => $r->permissions->map(fn($p) => [
                'id'           => $p->id,
                'name'         => $p->name,
                'display_name' => $p->display_name,
                'group'        => $p->group,
            ]),
        ]), 'Roles retrieved');
    }

    /**
     * GET /api/v1/roles/{id}
     * Get a single role with its permissions.
     */
    public function show(int $id): JsonResponse
    {
        $role = Role::with('permissions')->withCount('users')->findOrFail($id);

        return $this->success([
            'id'           => $role->id,
            'name'         => $role->name,
            'display_name' => $role->display_name,
            'description'  => $role->description,
            'users_count'  => $role->users_count,
            'is_system'    => in_array($role->name, [Role::SUPER_ADMIN, Role::ADMIN, Role::EDITOR]),
            'permissions'  => $role->permissions->map(fn($p) => [
                'id'           => $p->id,
                'name'         => $p->name,
                'display_name' => $p->display_name,
                'group'        => $p->group,
            ]),
        ], 'Role retrieved');
    }

    /**
     * GET /api/v1/permissions
     * List all available permissions grouped by category.
     */
    public function permissions(): JsonResponse
    {
        $permissions = Permission::all()->groupBy('group')->map(fn($items) =>
            $items->map(fn($p) => [
                'id'           => $p->id,
                'name'         => $p->name,
                'display_name' => $p->display_name,
            ])
        );

        return $this->success($permissions, 'Permissions retrieved');
    }

    /**
     * PUT /api/v1/roles/{id}/permissions
     * Sync permissions for a role. SUPER_ADMIN cannot be modified.
     */
    public function updatePermissions(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);

        // Protect system SUPER_ADMIN role from modification
        if ($role->name === Role::SUPER_ADMIN) {
            return $this->forbidden('SUPER_ADMIN permissions cannot be modified.');
        }

        $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        try {
            $role->permissions()->sync($request->input('permission_ids'));

            return $this->success(
                $role->fresh(['permissions'])->permissions->map(fn($p) => [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'display_name' => $p->display_name,
                    'group'        => $p->group,
                ]),
                'Role permissions updated successfully'
            );
        } catch (Throwable $e) {
            return $this->error('Failed to update permissions: ' . $e->getMessage(), 500);
        }
    }
}
