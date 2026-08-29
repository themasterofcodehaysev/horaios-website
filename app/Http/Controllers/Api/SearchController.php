<?php

namespace App\Http\Controllers\Api;

use App\Models\PrayerRequest;
use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends BaseApiController
{
    public function __construct(protected SearchService $searchService)
    {
    }

    public function global(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PrayerRequest::class);

        $query = $request->input('query');
        $type = $request->input('type');

        if (empty($query) || strlen($query) < 2) {
            return $this->error('Search query must be at least 2 characters', 400);
        }

        $results = $this->searchService->globalSearch($query, $type);

        return $this->success($results, 'Search results retrieved');
    }

    public function byType(Request $request, string $type): JsonResponse
    {
        $this->authorize('viewAny', PrayerRequest::class);

        $query = $request->input('query');
        $limit = $request->input('limit', 20);

        if (empty($query) || strlen($query) < 2) {
            return $this->error('Search query must be at least 2 characters', 400);
        }

        $results = $this->searchService->searchByType($type, $query, $limit);

        return $this->success($results, 'Search results retrieved');
    }
}
