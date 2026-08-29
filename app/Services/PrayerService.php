<?php

namespace App\Services;

use App\Models\PrayerRequest;
use App\Models\User;
use App\Notifications\PrayerRequestReceived;
use App\Jobs\SendPrayerRequestNotification;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PrayerService
{
    public function getPublicPrayerRequests(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = PrayerRequest::public()
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('title', 'like', $term)
                        ->orWhere('request', 'like', $term);
                });
            })
            ->when(!empty($filters['request_type']), fn($q) => $q->where('request_type', $filters['request_type']))
            ->when(!empty($filters['urgency']), fn($q) => $q->where('urgency', $filters['urgency']))
            ->orderBy('urgency', 'desc')
            ->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function getAdminPrayerRequests(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = PrayerRequest::with(['processor'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $term = "%{$filters['search']}%";
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term)
                        ->orWhere('title', 'like', $term)
                        ->orWhere('request', 'like', $term);
                });
            })
            ->when(!empty($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(!empty($filters['request_type']), fn($q) => $q->where('request_type', $filters['request_type']))
            ->when(!empty($filters['urgency']), fn($q) => $q->where('urgency', $filters['urgency']))
            ->when(isset($filters['allow_public_prayer']) && $filters['allow_public_prayer'] !== '', 
                fn($q) => $q->where('allow_public_prayer', filter_var($filters['allow_public_prayer'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_dir'] ?? 'desc');

        return $query->paginate($perPage);
    }

    public function createPrayerRequest(array $data): PrayerRequest
    {
        $data['uuid'] = (string) Str::uuid();
        $data['status'] = 'pending';

        $prayer = PrayerRequest::create($data);

        AuditLogService::log(
            'create',
            'PrayerRequest',
            (string) $prayer->id,
            null,
            $prayer->only(['id', 'name', 'title', 'request_type', 'urgency', 'status']),
            null
        );

        // Queue notification job for admin users about new prayer request
        SendPrayerRequestNotification::dispatch(
            $prayer->title,
            $prayer->name,
            $prayer->urgency
        );

        // Create in-app notification
        $adminUsers = User::whereHas('role', function ($query) {
            $query->where('name', 'admin')->orWhere('name', 'super_admin');
        })->get();

        $notificationService = new NotificationService();
        foreach ($adminUsers as $admin) {
            $notificationService->notifyNewPrayerRequest($admin, $prayer->title);
        }

        return $prayer;
    }

    public function updatePrayerRequest(PrayerRequest $prayer, array $data, ?User $actingUser = null): PrayerRequest
    {
        $oldValues = $prayer->only(['status', 'urgency', 'allow_public_prayer', 'admin_notes']);

        if (isset($data['status']) && $data['status'] !== $prayer->status) {
            $data['processed_by'] = $actingUser?->id;
            $data['processed_at'] = now();
        }

        $prayer->update($data);

        AuditLogService::log(
            'update',
            'PrayerRequest',
            (string) $prayer->id,
            $oldValues,
            $prayer->only(['status', 'urgency', 'allow_public_prayer', 'admin_notes']),
            $actingUser?->id
        );

        return $prayer->fresh(['processor']);
    }

    public function deletePrayerRequest(PrayerRequest $prayer, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'PrayerRequest',
            (string) $prayer->id,
            $prayer->only(['name', 'title', 'status']),
            null,
            $actingUser?->id
        );

        $prayer->delete();
    }

    public function updateStatus(PrayerRequest $prayer, string $status, ?User $actingUser = null): PrayerRequest
    {
        return $this->updatePrayerRequest($prayer, [
            'status' => $status,
            'processed_by' => $actingUser?->id,
            'processed_at' => now(),
        ], $actingUser);
    }

    public function getStats(): array
    {
        return [
            'total' => PrayerRequest::count(),
            'pending' => PrayerRequest::where('status', 'pending')->count(),
            'reviewed' => PrayerRequest::where('status', 'reviewed')->count(),
            'praying' => PrayerRequest::where('status', 'praying')->count(),
            'completed' => PrayerRequest::where('status', 'completed')->count(),
            'archived' => PrayerRequest::where('status', 'archived')->count(),
            'urgent' => PrayerRequest::where('urgency', 'urgent')->where('status', '!=', 'archived')->count(),
            'public' => PrayerRequest::where('allow_public_prayer', true)->where('status', '!=', 'archived')->count(),
        ];
    }
}
