<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\HomepageSectionResource;
use App\Models\HomepageSection;
use App\Services\HomepageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class HomepageController extends BaseApiController
{
    public function __construct(protected HomepageService $homepageService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', HomepageSection::class);

        $sections = $this->homepageService->getAllSections();

        return $this->success(HomepageSectionResource::collection($sections), 'Homepage sections retrieved');
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $sections = $this->homepageService->getVisibleSections();

        return $this->success(HomepageSectionResource::collection($sections), 'Public homepage sections retrieved');
    }

    public function show(Request $request, string $key): JsonResponse
    {
        $section = $this->homepageService->getSectionByKey($key);

        if (!$section) {
            return $this->notFound('Homepage section not found');
        }

        return $this->success(new HomepageSectionResource($section), 'Homepage section retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', HomepageSection::class);

        $request->validate([
            'key' => 'required|string|max:255|unique:homepage_sections,key',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'data' => 'nullable|array',
            'is_visible' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
            'background_image' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:50',
        ]);

        try {
            $section = $this->homepageService->createSection($request->validated(), $request->user());
            return $this->created(new HomepageSectionResource($section), 'Homepage section created');
        } catch (Throwable $e) {
            return $this->error('Failed to create homepage section: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $section = HomepageSection::findOrFail($id);
        $this->authorize('update', $section);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'data' => 'nullable|array',
            'is_visible' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
            'background_image' => 'nullable|string|max:500',
            'background_color' => 'nullable|string|max:50',
        ]);

        try {
            $updated = $this->homepageService->updateSection($section, $request->validated(), $request->user());
            return $this->success(new HomepageSectionResource($updated), 'Homepage section updated');
        } catch (Throwable $e) {
            return $this->error('Failed to update homepage section: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $section = HomepageSection::findOrFail($id);
        $this->authorize('delete', $section);

        try {
            $this->homepageService->deleteSection($section, $request->user());
            return $this->noContent('Homepage section deleted');
        } catch (Throwable $e) {
            return $this->error('Failed to delete homepage section: ' . $e->getMessage(), 500);
        }
    }

    public function reorder(Request $request): JsonResponse
    {
        $this->authorize('update', HomepageSection::class);

        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:homepage_sections,id',
            'sections.*.display_order' => 'required|integer',
        ]);

        try {
            $this->homepageService->reorderSections($request->input('sections'), $request->user());
            return $this->success(null, 'Homepage sections reordered');
        } catch (Throwable $e) {
            return $this->error('Failed to reorder homepage sections: ' . $e->getMessage(), 500);
        }
    }

    public function initialize(Request $request): JsonResponse
    {
        $this->authorize('create', HomepageSection::class);

        try {
            $this->homepageService->initializeDefaultSections();
            return $this->success(null, 'Default homepage sections initialized');
        } catch (Throwable $e) {
            return $this->error('Failed to initialize homepage sections: ' . $e->getMessage(), 500);
        }
    }
}
