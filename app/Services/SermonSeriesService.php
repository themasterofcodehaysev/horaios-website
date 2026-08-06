<?php

namespace App\Services;

use App\Models\SermonSeries;
use App\Models\User;

class SermonSeriesService
{
    public function getPublicSeries()
    {
        return SermonSeries::where('status', 'active')
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getAdminSeries()
    {
        return SermonSeries::withCount('sermons')
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function createSeries(array $data, ?User $actingUser = null): SermonSeries
    {
        $series = SermonSeries::create($data);

        AuditLogService::log(
            'create',
            'SermonSeries',
            (string) $series->id,
            null,
            $series->only(['id', 'name', 'status']),
            $actingUser?->id
        );

        return $series;
    }

    public function updateSeries(SermonSeries $series, array $data, ?User $actingUser = null): SermonSeries
    {
        $old = $series->only(['name', 'status']);
        $series->update($data);

        AuditLogService::log(
            'update',
            'SermonSeries',
            (string) $series->id,
            $old,
            $series->only(['name', 'status']),
            $actingUser?->id
        );

        return $series;
    }

    public function deleteSeries(SermonSeries $series, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'SermonSeries',
            (string) $series->id,
            $series->only(['name']),
            null,
            $actingUser?->id
        );

        $series->delete();
    }
}
