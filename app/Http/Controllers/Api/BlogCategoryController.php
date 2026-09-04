<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\BlogCategoryResource;
use App\Models\BlogCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class BlogCategoryController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $categories = BlogCategory::withCount('publishedPosts')
            ->where('status', 'active')
            ->when($request->has('sort_by'), function ($q) use ($request) {
                $q->orderBy($request->input('sort_by'), $request->input('sort_dir', 'asc'));
            })
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return $this->success(BlogCategoryResource::collection($categories), 'Active blog categories retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', BlogCategory::class);

        $categories = BlogCategory::withCount('publishedPosts')
            ->when($request->has('status'), fn($q) => $q->where('status', $request->input('status')))
            ->when($request->has('sort_by'), function ($q) use ($request) {
                $q->orderBy($request->input('sort_by'), $request->input('sort_dir', 'asc'));
            })
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return $this->success(BlogCategoryResource::collection($categories), 'Admin blog categories retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', BlogCategory::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category = BlogCategory::create($validated);
            return $this->created(new BlogCategoryResource($category), 'Blog category created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create blog category: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $category = BlogCategory::withCount('publishedPosts')->findOrFail($id);
        return $this->success(new BlogCategoryResource($category), 'Blog category details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = BlogCategory::findOrFail($id);
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'description'   => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $category->update($validated);
            return $this->success(new BlogCategoryResource($category->fresh()), 'Blog category updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update blog category: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = BlogCategory::findOrFail($id);
        $this->authorize('delete', $category);

        try {
            $category->delete();
            return $this->noContent('Blog category deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete blog category: ' . $e->getMessage(), 500);
        }
    }
}
