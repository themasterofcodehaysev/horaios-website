<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SermonSeriesResource;
use App\Models\SermonSeries;
use App\Services\SermonSeriesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SermonSeriesController extends BaseApiController
{
    public function __construct(protected SermonSeriesService $seriesService)
    {
    }

    public function index(): JsonResponse
    {
        $series = $this->seriesService->getPublicSeries();
        return $this->success(SermonSeriesResource::collection($series), 'Active sermon series retrieved');
    }

    public function adminIndex(): JsonResponse
    {
        $this->authorize('create', SermonSeries::class);
        $series = $this->seriesService->getAdminSeries();
        return $this->success(SermonSeriesResource::collection($series), 'Admin sermon series retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', SermonSeries::class);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:sermon_series,slug',
            'description'   => 'nullable|string',
            'thumbnail'     => 'nullable|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $series = $this->seriesService->createSeries($validated, $request->user());
            return $this->created(new SermonSeriesResource($series), 'Sermon series created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create sermon series: ' . $e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $series = SermonSeries::withCount('sermons')->findOrFail($id);
        return $this->success(new SermonSeriesResource($series), 'Sermon series details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $series = SermonSeries::findOrFail($id);
        $this->authorize('update', $series);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'slug'          => 'nullable|string|max:255|unique:sermon_series,slug,' . $id,
            'description'   => 'nullable|string',
            'thumbnail'     => 'nullable|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'status'        => 'nullable|in:active,inactive',
        ]);

        try {
            $updated = $this->seriesService->updateSeries($series, $validated, $request->user());
            return $this->success(new SermonSeriesResource($updated), 'Sermon series updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update sermon series: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $series = SermonSeries::findOrFail($id);
        $this->authorize('delete', $series);

        try {
            $this->seriesService->deleteSeries($series, $request->user());
            return $this->noContent('Sermon series deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete sermon series: ' . $e->getMessage(), 500);
        }
    }
}
