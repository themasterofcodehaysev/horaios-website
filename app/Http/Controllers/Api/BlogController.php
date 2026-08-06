<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Blog\CreateBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Http\Resources\BlogResource;
use App\Models\BlogPost;
use App\Services\BlogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class BlogController extends BaseApiController
{
    public function __construct(protected BlogService $blogService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $posts = $this->blogService->getPublicPosts([
            'search'        => $request->input('search'),
            'category_id'   => $request->input('category_id'),
            'category_slug' => $request->input('category_slug'),
            'featured'      => $request->input('featured'),
        ], $request->input('per_page', 12));

        return $this->paginated(BlogResource::collection($posts), 'Published blog posts retrieved');
    }

    public function show(string $identifier): JsonResponse
    {
        $post = BlogPost::with(['category', 'creator', 'updater'])
            ->where(function ($q) use ($identifier) {
                $q->where('slug', $identifier)
                  ->orWhere('uuid', $identifier)
                  ->orWhere('id', $identifier);
            })
            ->firstOrFail();

        if ($post->status !== 'published') {
            $this->authorize('view', $post);
        }

        return $this->success(new BlogResource($post), 'Blog post retrieved');
    }

    public function related(string $identifier): JsonResponse
    {
        $post = BlogPost::where('slug', $identifier)
            ->orWhere('uuid', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();

        $related = $this->blogService->getRelatedPosts($post, 5);

        return $this->success(BlogResource::collection($related), 'Related blog posts retrieved');
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('create', BlogPost::class);

        $posts = $this->blogService->getAdminPosts([
            'search'      => $request->input('search'),
            'category_id' => $request->input('category_id'),
            'status'      => $request->input('status'),
            'featured'    => $request->input('featured'),
            'sort_by'     => $request->input('sort_by'),
            'sort_dir'    => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(BlogResource::collection($posts), 'Admin blog posts retrieved');
    }

    public function store(CreateBlogPostRequest $request): JsonResponse
    {
        $this->authorize('create', BlogPost::class);

        try {
            $post = $this->blogService->createPost($request->validated(), $request->user());
            return $this->created(new BlogResource($post), 'Blog post created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create blog post: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateBlogPostRequest $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $this->authorize('update', $post);

        try {
            $updated = $this->blogService->updatePost($post, $request->validated(), $request->user());
            return $this->success(new BlogResource($updated), 'Blog post updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update blog post: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $this->authorize('delete', $post);

        try {
            $this->blogService->deletePost($post, $request->user());
            return $this->noContent('Blog post deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete blog post: ' . $e->getMessage(), 500);
        }
    }

    public function togglePublish(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $this->authorize('update', $post);

        $updated = $this->blogService->togglePublish($post, $request->user());
        return $this->success(new BlogResource($updated), "Blog post status changed to {$updated->status}");
    }

    public function toggleFeatured(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $this->authorize('update', $post);

        $updated = $this->blogService->toggleFeatured($post, $request->user());
        return $this->success(new BlogResource($updated), $updated->featured ? 'Blog post featured' : 'Blog post unfeatured');
    }

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $this->authorize('create', BlogPost::class);

        $duplicate = $this->blogService->duplicatePost($post, $request->user());
        return $this->created(new BlogResource($duplicate), 'Blog post duplicated successfully');
    }
}
