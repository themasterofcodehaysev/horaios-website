<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SongCategoryResource;
use App\Models\SongCategory;
use App\Services\SongCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SongCategoryController extends BaseApiController
{
    public function __construct(protected SongCategoryService $categoryService)
    {
    }

    /**
     * GET /api/v1/song-categories
     * Public / Admin list of categories.
     */
    public function index(Request $request): JsonResponse
    {
        $activeOnly = $request->boolean('active_only', false);
        $categories = $this->categoryService->getAllCategories($activeOnly);

        return $this->success(SongCategoryResource::collection($categories), 'Song categories retrieved');
    }

    /**
     * POST /api/v1/song-categories
     * Create category (Admin/Editor).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', SongCategory::class);

        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'description'   => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
            'status'        => ['nullable', 'in:active,inactive'],
        ]);

        $category = $this->categoryService->createCategory($validated, $request->user());

        return $this->created(new SongCategoryResource($category), 'Category created successfully');
    }

    /**
     * GET /api/v1/song-categories/{id}
     */
    public function show(int $id): JsonResponse
    {
        $category = SongCategory::withCount('songs')->findOrFail($id);

        return $this->success(new SongCategoryResource($category), 'Category retrieved');
    }

    /**
     * PUT /api/v1/song-categories/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = SongCategory::findOrFail($id);
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name'          => ['sometimes', 'required', 'string', 'max:255'],
            'description'   => ['nullable', 'string'],
            'display_order' => ['nullable', 'integer'],
            'status'        => ['nullable', 'in:active,inactive'],
        ]);

        $updated = $this->categoryService->updateCategory($category, $validated, $request->user());

        return $this->success(new SongCategoryResource($updated), 'Category updated successfully');
    }

    /**
     * DELETE /api/v1/song-categories/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = SongCategory::findOrFail($id);
        $this->authorize('delete', $category);

        $this->categoryService->deleteCategory($category, $request->user());

        return $this->noContent('Category deleted successfully');
    }
}
