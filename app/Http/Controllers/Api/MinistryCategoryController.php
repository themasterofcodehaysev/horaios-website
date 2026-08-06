<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\MinistryCategoryResource;
use App\Models\MinistryCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MinistryCategoryController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $categories = MinistryCategory::withCount('publishedMinistries')
            ->where('status', 'active')
            ->when($request->has('sort_by'), function ($q) use ($request) {
                $q->orderBy($request->input('sort_by'), $request->input('sort_dir', 'asc'));
            })
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return $this->success(MinistryCategoryResource::collection($categories), 'Active ministry categories retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', MinistryCategory::class);

        $categories = MinistryCategory::withCount('publishedMinistries')
            ->when($request->has('status'), fn($q) => $q->where('status', $request->input('status')))
            ->when($request->has('sort_by'), function ($q) use ($request) {
                $q->orderBy($request->input('sort_by'), $request->input('sort_dir', 'asc'));
            })
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return $this->success(MinistryCategoryResource::collection($categories), 'Admin ministry categories retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', MinistryCategory::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:ministry_categories,slug',
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category = MinistryCategory::create($validated);
            return $this->created(new MinistryCategoryResource($category), 'Ministry category created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create ministry category: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $category = MinistryCategory::withCount('publishedMinistries')->findOrFail($id);
        return $this->success(new MinistryCategoryResource($category), 'Ministry category details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = MinistryCategory::findOrFail($id);
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:ministry_categories,slug,' . $id,
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category->update($validated);
            return $this->success(new MinistryCategoryResource($category->fresh()), 'Ministry category updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update ministry category: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = MinistryCategory::findOrFail($id);
        $this->authorize('delete', $category);

        try {
            $category->delete();
            return $this->noContent('Ministry category deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete ministry category: ' . $e->getMessage(), 500);
        }
    }
}
