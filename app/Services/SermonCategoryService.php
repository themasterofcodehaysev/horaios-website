<?php

namespace App\Services;

use App\Models\SermonCategory;
use App\Models\User;

class SermonCategoryService
{
    public function getPublicCategories()
    {
        return SermonCategory::where('status', 'active')
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getAdminCategories()
    {
        return SermonCategory::withCount('sermons')
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function createCategory(array $data, ?User $actingUser = null): SermonCategory
    {
        $category = SermonCategory::create($data);

        AuditLogService::log(
            'create',
            'SermonCategory',
            (string) $category->id,
            null,
            $category->only(['id', 'name', 'status']),
            $actingUser?->id
        );

        return $category;
    }

    public function updateCategory(SermonCategory $category, array $data, ?User $actingUser = null): SermonCategory
    {
        $old = $category->only(['name', 'status']);
        $category->update($data);

        AuditLogService::log(
            'update',
            'SermonCategory',
            (string) $category->id,
            $old,
            $category->only(['name', 'status']),
            $actingUser?->id
        );

        return $category;
    }

    public function deleteCategory(SermonCategory $category, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'SermonCategory',
            (string) $category->id,
            $category->only(['name']),
            null,
            $actingUser?->id
        );

        $category->delete();
    }
}
