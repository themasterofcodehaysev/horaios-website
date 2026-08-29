<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    protected array $cacheTimes = [
        'short' => 300,      // 5 minutes
        'medium' => 1800,    // 30 minutes
        'long' => 3600,      // 1 hour
        'very_long' => 86400, // 24 hours
    ];

    public function rememberChurchSettings()
    {
        return Cache::remember('church_settings', $this->cacheTimes['very_long'], function () {
            return \App\Models\ChurchSetting::all();
        });
    }

    public function rememberPublicChurchSettings()
    {
        return Cache::remember('public_church_settings', $this->cacheTimes['very_long'], function () {
            return \App\Models\ChurchSetting::where('is_public', true)->get();
        });
    }

    public function rememberActiveNavigation($location = 'header')
    {
        return Cache::remember("active_navigation_{$location}", $this->cacheTimes['long'], function () use ($location) {
            return \App\Models\NavigationMenu::active()
                ->byLocation($location)
                ->with(['activeItems' => function ($query) {
                    $query->root()->with('children');
                }])
                ->orderBy('display_order')
                ->get();
        });
    }

    public function rememberHomepageSections()
    {
        return Cache::remember('homepage_sections', $this->cacheTimes['long'], function () {
            return \App\Models\HomepageSection::visible()->ordered()->get();
        });
    }

    public function rememberFooterSettings()
    {
        return Cache::remember('footer_settings', $this->cacheTimes['very_long'], function () {
            return \App\Models\FooterSetting::active()->ordered()->get();
        });
    }

    public function rememberMediaStats()
    {
        return Cache::remember('media_stats', $this->cacheTimes['medium'], function () {
            return \App\Models\Media::selectRaw('
                COUNT(*) as total_files,
                SUM(file_size) as total_size,
                COUNT(CASE WHEN mime_type LIKE "image%" THEN 1 END) as image_count,
                COUNT(CASE WHEN mime_type LIKE "audio%" THEN 1 END) as audio_count,
                COUNT(CASE WHEN mime_type LIKE "video%" THEN 1 END) as video_count,
                COUNT(CASE WHEN mime_type LIKE "application/pdf" THEN 1 END) as document_count
            ')->first();
        });
    }

    public function rememberPrayerRequestStats()
    {
        return Cache::remember('prayer_request_stats', $this->cacheTimes['short'], function () {
            return \App\Models\PrayerRequest::selectRaw('
                COUNT(*) as total,
                COUNT(CASE WHEN status = "pending" THEN 1 END) as pending,
                COUNT(CASE WHEN status = "answered" THEN 1 END) as answered,
                COUNT(CASE WHEN status = "declined" THEN 1 END) as declined
            ')->first();
        });
    }

    public function rememberContactMessageStats()
    {
        return Cache::remember('contact_message_stats', $this->cacheTimes['short'], function () {
            return \App\Models\ContactMessage::selectRaw('
                COUNT(*) as total,
                COUNT(CASE WHEN status = "new" THEN 1 END) as new,
                COUNT(CASE WHEN status = "in_progress" THEN 1 END) as in_progress,
                COUNT(CASE WHEN status = "resolved" THEN 1 END) as resolved
            ')->first();
        });
    }

    public function clearNavigationCache()
    {
        Cache::forget('active_navigation_header');
        Cache::forget('active_navigation_footer');
        Cache::forget('active_navigation_quick_links');
    }

    public function clearHomepageCache()
    {
        Cache::forget('homepage_sections');
    }

    public function clearFooterCache()
    {
        Cache::forget('footer_settings');
    }

    public function clearChurchSettingsCache()
    {
        Cache::forget('church_settings');
        Cache::forget('public_church_settings');
    }

    public function clearMediaStatsCache()
    {
        Cache::forget('media_stats');
    }

    public function clearAllCaches()
    {
        Cache::flush();
    }
}
