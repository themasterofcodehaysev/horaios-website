<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SpeakerResource;
use App\Models\Speaker;
use App\Services\SpeakerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SpeakerController extends BaseApiController
{
    public function __construct(protected SpeakerService $speakerService)
    {
    }

    public function index(): JsonResponse
    {
        $speakers = $this->speakerService->getPublicSpeakers();
        return $this->success(SpeakerResource::collection($speakers), 'Active speakers retrieved');
    }

    public function adminIndex(): JsonResponse
    {
        $this->authorize('create', Speaker::class);
        $speakers = $this->speakerService->getAdminSpeakers();
        return $this->success(SpeakerResource::collection($speakers), 'Admin speakers retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Speaker::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:speakers,slug',
            'photo'         => 'nullable|string|max:500',
            'biography'     => 'nullable|string',
            'position'      => 'nullable|string|max:255',
            'email'         => 'nullable|email|max:255',
            'facebook'      => 'nullable|url|max:255',
            'status'        => 'nullable|in:active,inactive',
            'display_order' => 'nullable|integer|min:0',
        ]);

        try {
            $speaker = $this->speakerService->createSpeaker($validated, $request->user());
            return $this->created(new SpeakerResource($speaker), 'Speaker created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create speaker: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $speaker = Speaker::withCount('sermons')->findOrFail($id);
        return $this->success(new SpeakerResource($speaker), 'Speaker details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $speaker = Speaker::findOrFail($id);
        $this->authorize('update', $speaker);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:speakers,slug,' . $id,
            'photo'         => 'nullable|string|max:500',
            'biography'     => 'nullable|string',
            'position'      => 'nullable|string|max:255',
            'email'         => 'nullable|email|max:255',
            'facebook'      => 'nullable|url|max:255',
            'status'        => 'nullable|in:active,inactive',
            'display_order' => 'nullable|integer|min:0',
        ]);

        try {
            $updated = $this->speakerService->updateSpeaker($speaker, $validated, $request->user());
            return $this->success(new SpeakerResource($updated), 'Speaker updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update speaker: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $speaker = Speaker::findOrFail($id);
        $this->authorize('delete', $speaker);

        try {
            $this->speakerService->deleteSpeaker($speaker, $request->user());
            return $this->noContent('Speaker deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete speaker: ' . $e->getMessage(), 500);
        }
    }

    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $speaker = Speaker::findOrFail($id);
        $this->authorize('update', $speaker);

        $updated = $this->speakerService->toggleStatus($speaker, $request->user());
        return $this->success(new SpeakerResource($updated), "Speaker status changed to {$updated->status}");
    }
}
