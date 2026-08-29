<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Prayer\CreatePrayerRequest;
use App\Http\Requests\Prayer\UpdatePrayerRequest;
use App\Http\Resources\PrayerRequestResource;
use App\Models\PrayerRequest;
use App\Services\PrayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PrayerController extends BaseApiController
{
    public function __construct(protected PrayerService $prayerService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $prayers = $this->prayerService->getPublicPrayerRequests([
            'search' => $request->input('search'),
            'request_type' => $request->input('request_type'),
            'urgency' => $request->input('urgency'),
        ], $request->input('per_page', 12));

        return $this->paginated(PrayerRequestResource::collection($prayers), 'Public prayer requests retrieved');
    }

    public function show(string $uuid): JsonResponse
    {
        $prayer = PrayerRequest::where('uuid', $uuid)
            ->where('allow_public_prayer', true)
            ->where('status', '!=', 'archived')
            ->where('status', '!=', 'pending')
            ->firstOrFail();

        return $this->success(new PrayerRequestResource($prayer), 'Prayer request retrieved');
    }

    public function store(CreatePrayerRequest $request): JsonResponse
    {
        try {
            $prayer = $this->prayerService->createPrayerRequest($request->validated());
            return $this->created(new PrayerRequestResource($prayer), 'Prayer request submitted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to submit prayer request: ' . $e->getMessage(), 500);
        }
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrayerRequest::class);

        $prayers = $this->prayerService->getAdminPrayerRequests([
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'request_type' => $request->input('request_type'),
            'urgency' => $request->input('urgency'),
            'allow_public_prayer' => $request->input('allow_public_prayer'),
            'sort_by' => $request->input('sort_by'),
            'sort_dir' => $request->input('sort_dir'),
        ], $request->input('per_page', 15));

        return $this->paginated(PrayerRequestResource::collection($prayers), 'Admin prayer requests retrieved');
    }

    public function adminShow(int $id): JsonResponse
    {
        $this->authorize('viewAny', PrayerRequest::class);

        $prayer = PrayerRequest::with(['processor'])->findOrFail($id);

        return $this->success(new PrayerRequestResource($prayer), 'Prayer request retrieved');
    }

    public function update(UpdatePrayerRequest $request, int $id): JsonResponse
    {
        $prayer = PrayerRequest::findOrFail($id);
        $this->authorize('update', $prayer);

        try {
            $updated = $this->prayerService->updatePrayerRequest($prayer, $request->validated(), $request->user());
            return $this->success(new PrayerRequestResource($updated), 'Prayer request updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update prayer request: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $prayer = PrayerRequest::findOrFail($id);
        $this->authorize('delete', $prayer);

        try {
            $this->prayerService->deletePrayerRequest($prayer, $request->user());
            return $this->noContent('Prayer request deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete prayer request: ' . $e->getMessage(), 500);
        }
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $prayer = PrayerRequest::findOrFail($id);
        $this->authorize('update', $prayer);

        $request->validate(['status' => 'required|in:pending,reviewed,praying,completed,archived']);

        try {
            $updated = $this->prayerService->updateStatus($prayer, $request->input('status'), $request->user());
            return $this->success(new PrayerRequestResource($updated), 'Prayer request status updated');
        } catch (Throwable $e) {
            return $this->error('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrayerRequest::class);

        $stats = $this->prayerService->getStats();

        return $this->success($stats, 'Prayer request statistics retrieved');
    }
}
