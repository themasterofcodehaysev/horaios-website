<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends BaseApiController
{
    /**
     * GET /api/audit-logs
     * Return paginated audit logs with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $query = AuditLog::with('user')
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->action, fn($q) => $q->where('action', $request->action))
            ->when($request->entity, fn($q) => $q->where('entity', $request->entity))
            ->when($request->entity_id, fn($q) => $q->where('entity_id', $request->entity_id))
            ->when($request->date_from, fn($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->orderBy('created_at', 'desc');

        $logs = $query->paginate($request->per_page ?? 25);

        return $this->paginated(AuditLogResource::collection($logs), 'Audit logs retrieved');
    }

    /**
     * GET /api/audit-logs/{id}
     * Return a single audit log entry.
     */
    public function show(int $id): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $log = AuditLog::with('user')->findOrFail($id);

        return $this->success(new AuditLogResource($log), 'Audit log retrieved');
    }
}
