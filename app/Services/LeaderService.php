<?php

namespace App\Services;

use App\Models\Leader;
use App\Models\User;

class LeaderService
{
    public function getPublicLeaders()
    {
        return Leader::active()
            ->ordered()
            ->get();
    }

    public function getAdminLeaders()
    {
        return Leader::ordered()
            ->get();
    }

    public function createLeader(array $data, ?User $actingUser = null): Leader
    {
        $leader = Leader::create($data);

        AuditLogService::log(
            'create',
            'Leader',
            (string) $leader->id,
            null,
            $leader->only(['id', 'name', 'role', 'status']),
            $actingUser?->id
        );

        return $leader;
    }

    public function updateLeader(Leader $leader, array $data, ?User $actingUser = null): Leader
    {
        $old = $leader->only(['name', 'role', 'status']);
        $leader->update($data);

        AuditLogService::log(
            'update',
            'Leader',
            (string) $leader->id,
            $old,
            $leader->only(['name', 'role', 'status']),
            $actingUser?->id
        );

        return $leader;
    }

    public function deleteLeader(Leader $leader, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'Leader',
            (string) $leader->id,
            $leader->only(['name', 'role']),
            null,
            $actingUser?->id
        );

        $leader->delete();
    }

    public function toggleStatus(Leader $leader, ?User $actingUser = null): Leader
    {
        $newStatus = $leader->status === 'active' ? 'inactive' : 'active';
        $leader->update(['status' => $newStatus]);

        AuditLogService::log(
            'toggle_status',
            'Leader',
            (string) $leader->id,
            ['status' => $leader->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $leader;
    }

    public function reorderLeaders(array $orders, ?User $actingUser = null): void
    {
        foreach ($orders as $item) {
            if (isset($item['id'], $item['display_order'])) {
                Leader::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }
        }

        AuditLogService::log(
            'reorder',
            'Leader',
            'bulk',
            null,
            ['count' => count($orders)],
            $actingUser?->id
        );
    }
}
