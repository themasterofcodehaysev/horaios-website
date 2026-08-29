<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\FooterSettingResource;
use App\Models\FooterSetting;
use App\Services\FooterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class FooterController extends BaseApiController
{
    public function __construct(protected FooterService $footerService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', FooterSetting::class);

        $settings = $this->footerService->getAllSettings();

        return $this->success(FooterSettingResource::collection($settings), 'Footer settings retrieved');
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $settings = $this->footerService->getPublicFooterSettings();

        return $this->success($settings, 'Public footer settings retrieved');
    }

    public function show(Request $request, string $key): JsonResponse
    {
        $setting = FooterSetting::where('key', $key)->firstOrFail();

        return $this->success(new FooterSettingResource($setting), 'Footer setting retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', FooterSetting::class);

        $request->validate([
            'key' => 'required|string|max:255|unique:footer_settings,key',
            'value' => 'nullable|string',
            'type' => 'required|in:text,image,html,json,boolean,integer',
            'group' => 'required|in:general,social,contact,links',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        try {
            $setting = $this->footerService->createSetting($request->validated(), $request->user());
            return $this->created(new FooterSettingResource($setting), 'Footer setting created');
        } catch (Throwable $e) {
            return $this->error('Failed to create footer setting: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $setting = FooterSetting::findOrFail($id);
        $this->authorize('update', $setting);

        $request->validate([
            'value' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        try {
            $updated = $this->footerService->updateSetting($setting, $request->validated(), $request->user());
            return $this->success(new FooterSettingResource($updated), 'Footer setting updated');
        } catch (Throwable $e) {
            return $this->error('Failed to update footer setting: ' . $e->getMessage(), 500);
        }
    }

    public function updateBatch(Request $request): JsonResponse
    {
        $this->authorize('update', FooterSetting::class);

        $request->validate([
            'settings' => 'required|array',
        ]);

        try {
            $this->footerService->updateSettingsBatch($request->input('settings'), $request->user());
            return $this->success(null, 'Footer settings updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update footer settings: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $setting = FooterSetting::findOrFail($id);
        $this->authorize('delete', $setting);

        try {
            $this->footerService->deleteSetting($setting, $request->user());
            return $this->noContent('Footer setting deleted');
        } catch (Throwable $e) {
            return $this->error('Failed to delete footer setting: ' . $e->getMessage(), 500);
        }
    }

    public function initialize(Request $request): JsonResponse
    {
        $this->authorize('create', FooterSetting::class);

        try {
            $this->footerService->initializeDefaultSettings();
            return $this->success(null, 'Default footer settings initialized');
        } catch (Throwable $e) {
            return $this->error('Failed to initialize footer settings: ' . $e->getMessage(), 500);
        }
    }
}
