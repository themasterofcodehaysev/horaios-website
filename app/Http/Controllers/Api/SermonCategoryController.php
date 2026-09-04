<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SermonCategoryResource;
use App\Models\SermonCategory;
use App\Services\SermonCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SermonCategoryController extends BaseApiController
{
    public function __construct(protected SermonCategoryService $categoryService)
    {
    }

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getPublicCategories();
        return $this->success(SermonCategoryResource::collection($categories), 'Active sermon categories retrieved');
    }

    public function adminIndex(): JsonResponse
    {
        $this->authorize('create', SermonCategory::class);
        $categories = $this->categoryService->getAdminCategories();
        return $this->success(SermonCategoryResource::collection($categories), 'Admin sermon categories retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', SermonCategory::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category = $this->categoryService->createCategory($validated, $request->user());
            return $this->created(new SermonCategoryResource($category), 'Sermon category created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create sermon category: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $category = SermonCategory::withCount('sermons')->findOrFail($id);
        return $this->success(new SermonCategoryResource($category), 'Sermon category details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = SermonCategory::findOrFail($id);
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $updated = $this->categoryService->updateCategory($category, $validated, $request->user());
            return $this->success(new SermonCategoryResource($updated), 'Sermon category updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update sermon category: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = SermonCategory::findOrFail($id);
        $this->authorize('delete', $category);

        try {
            $this->categoryService->deleteCategory($category, $request->user());
            return $this->noContent('Sermon category deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete sermon category: ' . $e->getMessage(), 500);
        }
    }
}
