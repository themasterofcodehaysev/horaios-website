<?php

namespace App\Services;

use App\Models\NavigationMenu;
use App\Models\NavigationMenuItem;
use App\Models\User;
use Illuminate\Support\Str;

class NavigationService
{
    public function getMenusByLocation(string $location): \Illuminate\Database\Eloquent\Collection
    {
        return NavigationMenu::active()
            ->byLocation($location)
            ->with(['activeItems' => function ($query) {
                $query->root()->with('children');
            }])
            ->orderBy('display_order')
            ->get();
    }

    public function getAllMenus(): \Illuminate\Database\Eloquent\Collection
    {
        return NavigationMenu::with(['items' => function ($query) {
            $query->with('parent')->orderBy('display_order')->orderBy('id');
        }])->orderBy('display_order')->get();
    }

    public function createMenu(array $data, ?User $actingUser = null): NavigationMenu
    {
        $data['uuid'] = (string) Str::uuid();

        $menu = NavigationMenu::create($data);

        AuditLogService::log(
            'create',
            'NavigationMenu',
            (string) $menu->id,
            null,
            $menu->only(['name', 'location']),
            $actingUser?->id
        );

        return $menu;
    }

    public function updateMenu(NavigationMenu $menu, array $data, ?User $actingUser = null): NavigationMenu
    {
        $oldValues = $menu->only(['name', 'location', 'is_active', 'display_order']);

        $menu->update($data);

        AuditLogService::log(
            'update',
            'NavigationMenu',
            (string) $menu->id,
            $oldValues,
            $menu->only(['name', 'location', 'is_active', 'display_order']),
            $actingUser?->id
        );

        return $menu->fresh();
    }

    public function deleteMenu(NavigationMenu $menu, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'NavigationMenu',
            (string) $menu->id,
            $menu->only(['name', 'location']),
            null,
            $actingUser?->id
        );

        $menu->delete();
    }

    public function createMenuItem(array $data, ?User $actingUser = null): NavigationMenuItem
    {
        $data['uuid'] = (string) Str::uuid();

        $item = NavigationMenuItem::create($data);

        AuditLogService::log(
            'create',
            'NavigationMenuItem',
            (string) $item->id,
            null,
            $item->only(['label', 'url', 'menu_id']),
            $actingUser?->id
        );

        return $item->load(['menu', 'parent']);
    }

    public function updateMenuItem(NavigationMenuItem $item, array $data, ?User $actingUser = null): NavigationMenuItem
    {
        $oldValues = $item->only(['label', 'url', 'is_external', 'open_in_new_tab', 'is_active', 'display_order']);

        $item->update($data);

        AuditLogService::log(
            'update',
            'NavigationMenuItem',
            (string) $item->id,
            $oldValues,
            $item->only(['label', 'url', 'is_external', 'open_in_new_tab', 'is_active', 'display_order']),
            $actingUser?->id
        );

        return $item->fresh(['menu', 'parent']);
    }

    public function deleteMenuItem(NavigationMenuItem $item, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'NavigationMenuItem',
            (string) $item->id,
            $item->only(['label', 'url', 'menu_id']),
            null,
            $actingUser?->id
        );

        $item->delete();
    }

    public function reorderMenuItems(int $menuId, array $itemOrders, ?User $actingUser = null): void
    {
        foreach ($itemOrders as $order) {
            NavigationMenuItem::where('id', $order['id'])
                ->where('menu_id', $menuId)
                ->update(['display_order' => $order['display_order']]);
        }

        AuditLogService::log(
            'reorder',
            'NavigationMenuItem',
            (string) $menuId,
            null,
            ['item_count' => count($itemOrders)],
            $actingUser?->id
        );
    }
}
