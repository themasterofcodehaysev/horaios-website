<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Setting\UpdateSettingsRequest;
use App\Http\Resources\ChurchSettingResource;
use App\Models\ChurchSetting;
use App\Services\ChurchSettingService;
use Illuminate\Http\JsonResponse;
use Throwable;

class ChurchSettingController extends BaseApiController
{
    public function __construct(protected ChurchSettingService $settingService)
    {
    }

    /**
     * GET /api/settings/church
     * Return all church settings grouped by group key.
     */
    public function index(): JsonResponse
    {
        $settings = ChurchSetting::all();

        // Group settings by their group field for a structured response
        $grouped = $settings->groupBy('group')->map(function ($items) {
            return $items->mapWithKeys(fn($item) => [$item->key => $item->value]);
        });

        return $this->success($grouped, 'Church settings retrieved');
    }

    /**
     * GET /api/settings/church/public
     * Return only public-facing church settings (no auth required).
     */
    public function public(): JsonResponse
    {
        $settings = ChurchSetting::where('is_public', true)->get();

        $grouped = $settings->groupBy('group')->map(function ($items) {
            return $items->mapWithKeys(fn($item) => [$item->key => $item->value]);
        });

        return $this->success($grouped, 'Public church settings retrieved');
    }

    /**
     * PUT /api/settings/church
     * Batch update church settings.
     */
    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $this->authorize('update', ChurchSetting::class);

        try {
            $updated = $this->settingService->updateSettings($request->validated('settings'), $request->user());

            return $this->success(
                ChurchSettingResource::collection($updated),
                'Church settings updated successfully'
            );
        } catch (Throwable $e) {
            return $this->error('Failed to update settings: ' . $e->getMessage(), 500);
        }
    }
}
