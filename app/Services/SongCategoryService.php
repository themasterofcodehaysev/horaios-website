<?php

namespace App\Services;

use App\Models\SongCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SongCategoryService
{
    public function getAllCategories(bool $activeOnly = false): Collection
    {
        return SongCategory::withCount(['songs' => function ($q) {
            $q->where('status', 'published');
        }])
        ->when($activeOnly, fn($q) => $q->where('status', 'active'))
        ->orderBy('display_order', 'asc')
        ->orderBy('name', 'asc')
        ->get();
    }

    public function createCategory(array $data, ?User $actingUser = null): SongCategory
    {
        $data['uuid'] = (string) Str::uuid();

        $category = SongCategory::create($data);

        AuditLogService::log(
            'create',
            'SongCategory',
            (string) $category->id,
            null,
            $category->toArray(),
            $actingUser?->id
        );

        return $category;
    }

    public function updateCategory(SongCategory $category, array $data, ?User $actingUser = null): SongCategory
    {
        $oldValues = $category->toArray();
        $category->update($data);

        AuditLogService::log(
            'update',
            'SongCategory',
            (string) $category->id,
            $oldValues,
            $category->toArray(),
            $actingUser?->id
        );

        return $category->fresh();
    }

    public function deleteCategory(SongCategory $category, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'SongCategory',
            (string) $category->id,
            $category->toArray(),
            null,
            $actingUser?->id
        );

        $category->delete();
    }
}
