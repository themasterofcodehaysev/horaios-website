<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\NavigationMenuResource;
use App\Http\Resources\NavigationMenuItemResource;
use App\Models\NavigationMenu;
use App\Models\NavigationMenuItem;
use App\Services\NavigationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class NavigationController extends BaseApiController
{
    public function __construct(protected NavigationService $navigationService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', NavigationMenu::class);

        $menus = $this->navigationService->getAllMenus();

        return $this->success(NavigationMenuResource::collection($menus), 'Navigation menus retrieved');
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $location = $request->input('location', 'header');
        $menus = $this->navigationService->getMenusByLocation($location);

        return $this->success(NavigationMenuResource::collection($menus), 'Public navigation retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', NavigationMenu::class);

        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|in:header,footer,quick_links',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        try {
            $menu = $this->navigationService->createMenu($request->validated(), $request->user());
            return $this->created(new NavigationMenuResource($menu->load('items')), 'Navigation menu created');
        } catch (Throwable $e) {
            return $this->error('Failed to create navigation menu: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $menu = NavigationMenu::findOrFail($id);
        $this->authorize('update', $menu);

        $request->validate([
            'name' => 'nullable|string|max:255',
            'location' => 'nullable|in:header,footer,quick_links',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        try {
            $updated = $this->navigationService->updateMenu($menu, $request->validated(), $request->user());
            return $this->success(new NavigationMenuResource($updated->load('items')), 'Navigation menu updated');
        } catch (Throwable $e) {
            return $this->error('Failed to update navigation menu: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $menu = NavigationMenu::findOrFail($id);
        $this->authorize('delete', $menu);

        try {
            $this->navigationService->deleteMenu($menu, $request->user());
            return $this->noContent('Navigation menu deleted');
        } catch (Throwable $e) {
            return $this->error('Failed to delete navigation menu: ' . $e->getMessage(), 500);
        }
    }

    public function storeItem(Request $request): JsonResponse
    {
        $this->authorize('create', NavigationMenuItem::class);

        $request->validate([
            'menu_id' => 'required|exists:navigation_menus,id',
            'parent_id' => 'nullable|exists:navigation_menu_items,id',
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:500',
            'is_external' => 'nullable|boolean',
            'open_in_new_tab' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
            'icon' => 'nullable|string|max:50',
        ]);

        try {
            $item = $this->navigationService->createMenuItem($request->validated(), $request->user());
            return $this->created(new NavigationMenuItemResource($item), 'Navigation item created');
        } catch (Throwable $e) {
            return $this->error('Failed to create navigation item: ' . $e->getMessage(), 500);
        }
    }

    public function updateItem(Request $request, int $id): JsonResponse
    {
        $item = NavigationMenuItem::findOrFail($id);
        $this->authorize('update', $item);

        $request->validate([
            'label' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:500',
            'is_external' => 'nullable|boolean',
            'open_in_new_tab' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
            'icon' => 'nullable|string|max:50',
        ]);

        try {
            $updated = $this->navigationService->updateMenuItem($item, $request->validated(), $request->user());
            return $this->success(new NavigationMenuItemResource($updated), 'Navigation item updated');
        } catch (Throwable $e) {
            return $this->error('Failed to update navigation item: ' . $e->getMessage(), 500);
        }
    }

    public function destroyItem(Request $request, int $id): JsonResponse
    {
        $item = NavigationMenuItem::findOrFail($id);
        $this->authorize('delete', $item);

        try {
            $this->navigationService->deleteMenuItem($item, $request->user());
            return $this->noContent('Navigation item deleted');
        } catch (Throwable $e) {
            return $this->error('Failed to delete navigation item: ' . $e->getMessage(), 500);
        }
    }

    public function reorderItems(Request $request, int $menuId): JsonResponse
    {
        $this->authorize('update', NavigationMenu::class);

        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:navigation_menu_items,id',
            'items.*.display_order' => 'required|integer',
        ]);

        try {
            $this->navigationService->reorderMenuItems($menuId, $request->input('items'), $request->user());
            return $this->success(null, 'Navigation items reordered');
        } catch (Throwable $e) {
            return $this->error('Failed to reorder navigation items: ' . $e->getMessage(), 500);
        }
    }
}
