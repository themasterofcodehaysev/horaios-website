<?php

namespace App\Services;

use App\Models\HomepageSection;
use App\Models\User;
use Illuminate\Support\Str;

class HomepageService
{
    public function getVisibleSections(): \Illuminate\Database\Eloquent\Collection
    {
        return HomepageSection::visible()->ordered()->get();
    }

    public function getAllSections(): \Illuminate\Database\Eloquent\Collection
    {
        return HomepageSection::ordered()->get();
    }

    public function getSectionByKey(string $key): ?HomepageSection
    {
        return HomepageSection::where('key', $key)->first();
    }

    public function createSection(array $data, ?User $actingUser = null): HomepageSection
    {
        $data['uuid'] = (string) Str::uuid();

        $section = HomepageSection::create($data);

        AuditLogService::log(
            'create',
            'HomepageSection',
            (string) $section->id,
            null,
            $section->only(['key', 'title', 'is_visible']),
            $actingUser?->id
        );

        return $section;
    }

    public function updateSection(HomepageSection $section, array $data, ?User $actingUser = null): HomepageSection
    {
        $oldValues = $section->only(['title', 'content', 'is_visible', 'display_order', 'background_image']);

        $section->update($data);

        AuditLogService::log(
            'update',
            'HomepageSection',
            (string) $section->id,
            $oldValues,
            $section->only(['title', 'content', 'is_visible', 'display_order', 'background_image']),
            $actingUser?->id
        );

        return $section->fresh();
    }

    public function deleteSection(HomepageSection $section, ?User $actingUser = null): void
    {
        AuditLogService::log(
            'delete',
            'HomepageSection',
            (string) $section->id,
            $section->only(['key', 'title']),
            null,
            $actingUser?->id
        );

        $section->delete();
    }

    public function reorderSections(array $sectionOrders, ?User $actingUser = null): void
    {
        foreach ($sectionOrders as $order) {
            HomepageSection::where('id', $order['id'])
                ->update(['display_order' => $order['display_order']]);
        }

        AuditLogService::log(
            'reorder',
            'HomepageSection',
            'homepage',
            null,
            ['section_count' => count($sectionOrders)],
            $actingUser?->id
        );
    }

    public function initializeDefaultSections(): void
    {
        $defaultSections = [
            [
                'key' => 'hero',
                'title' => 'Hero Section',
                'content' => 'Welcome to our church',
                'data' => [
                    'button_text' => 'Join Us',
                    'button_link' => '/contact',
                    'subtitle' => 'A place to belong, believe, and become',
                ],
                'is_visible' => true,
                'display_order' => 1,
            ],
            [
                'key' => 'welcome',
                'title' => 'Welcome Message',
                'content' => 'Welcome to Horaios Baptist Church',
                'data' => [
                    'description' => 'We are a community of believers dedicated to following Jesus and serving our community.',
                ],
                'is_visible' => true,
                'display_order' => 2,
            ],
            [
                'key' => 'about',
                'title' => 'About Section',
                'content' => 'About Our Church',
                'data' => [
                    'description' => 'Learn more about our mission, vision, and values.',
                ],
                'is_visible' => true,
                'display_order' => 3,
            ],
            [
                'key' => 'events',
                'title' => 'Upcoming Events',
                'content' => 'Upcoming Events',
                'data' => [
                    'limit' => 3,
                ],
                'is_visible' => true,
                'display_order' => 4,
            ],
            [
                'key' => 'sermons',
                'title' => 'Featured Sermons',
                'content' => 'Latest Sermons',
                'data' => [
                    'limit' => 3,
                ],
                'is_visible' => true,
                'display_order' => 5,
            ],
            [
                'key' => 'ministries',
                'title' => 'Our Ministries',
                'content' => 'Ministries',
                'data' => [
                    'limit' => 4,
                ],
                'is_visible' => true,
                'display_order' => 6,
            ],
            [
                'key' => 'cta',
                'title' => 'Call to Action',
                'content' => 'Get Involved',
                'data' => [
                    'button_text' => 'Get Started',
                    'button_link' => '/contact',
                ],
                'is_visible' => true,
                'display_order' => 7,
            ],
        ];

        foreach ($defaultSections as $section) {
            HomepageSection::firstOrCreate(
                ['key' => $section['key']],
                array_merge($section, ['uuid' => (string) Str::uuid()])
            );
        }
    }
}
