<?php

namespace App\Services;

use App\Models\Speaker;
use App\Models\User;

class SpeakerService
{
    public function getPublicSpeakers()
    {
        return Speaker::where('status', 'active')
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getAdminSpeakers()
    {
        return Speaker::withCount('sermons')
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function createSpeaker(array $data, ?User $actingUser = null): Speaker
    {
        $speaker = Speaker::create($data);

        AuditLogService::log(
            'create',
            'Speaker',
            (string) $speaker->id,
            null,
            $speaker->only(['id', 'name', 'position', 'status']),
            $actingUser?->id
        );

        return $speaker;
    }

    public function updateSpeaker(Speaker $speaker, array $data, ?User $actingUser = null): Speaker
    {
        $old = $speaker->only(['name', 'position', 'status']);
        $speaker->update($data);

        AuditLogService::log(
            'update',
            'Speaker',
            (string) $speaker->id,
            $old,
            $speaker->only(['name', 'position', 'status']),
            $actingUser?->id
        );

        return $speaker;
    }

    public function deleteSpeaker(Speaker $speaker, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'Speaker',
            (string) $speaker->id,
            $speaker->only(['name', 'position']),
            null,
            $actingUser?->id
        );

        $speaker->delete();
    }

    public function toggleStatus(Speaker $speaker, ?User $actingUser = null): Speaker
    {
        $newStatus = $speaker->status === 'active' ? 'inactive' : 'active';
        $speaker->update(['status' => $newStatus]);

        AuditLogService::log(
            'toggle_status',
            'Speaker',
            (string) $speaker->id,
            ['status' => $speaker->getOriginal('status')],
            ['status' => $newStatus],
            $actingUser?->id
        );

        return $speaker;
    }
}
