<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\Media;
use App\Models\Ministry;
use App\Models\PrayerRequest;
use App\Models\Sermon;
use App\Models\Song;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class SearchService
{
    public function globalSearch(string $query, ?string $type = null): array
    {
        $cacheKey = 'search_global_' . md5($query . '_' . ($type ?? 'all'));
        
        return Cache::remember($cacheKey, 300, function () use ($query, $type) {
            $results = [];
            $term = "%{$query}%";

            if (!$type || $type === 'prayer_requests') {
                $results['prayer_requests'] = PrayerRequest::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit(5)
                    ->get(['id', 'title', 'status', 'created_at']);
            }

            if (!$type || $type === 'contact_messages') {
                $results['contact_messages'] = ContactMessage::where('subject', 'like', $term)
                    ->limit(5)
                    ->get(['id', 'subject', 'status', 'created_at']);
            }

            if (!$type || $type === 'media') {
                $results['media'] = Media::where('original_filename', 'like', $term)
                    ->limit(5)
                    ->get(['id', 'original_filename', 'mime_type', 'created_at']);
            }

            if (!$type || $type === 'blogs') {
                $results['blogs'] = BlogPost::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit(5)
                    ->get(['id', 'title', 'status', 'created_at']);
            }

            if (!$type || $type === 'sermons') {
                $results['sermons'] = Sermon::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit(5)
                    ->get(['id', 'title', 'status', 'created_at']);
            }

            if (!$type || $type === 'songs') {
                $results['songs'] = Song::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit(5)
                    ->get(['id', 'title', 'status', 'created_at']);
            }

            if (!$type || $type === 'events') {
                $results['events'] = Event::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit(5)
                    ->get(['id', 'title', 'status', 'created_at']);
            }

            if (!$type || $type === 'ministries') {
                $results['ministries'] = Ministry::where('name', 'like', $term)
                    ->where('status', 'published')
                    ->limit(5)
                    ->get(['id', 'name', 'status', 'created_at']);
            }

            return $results;
        });
    }

    public function searchByType(string $type, string $query, int $limit = 20): Collection
    {
        $cacheKey = 'search_' . $type . '_' . md5($query);
        
        return Cache::remember($cacheKey, 300, function () use ($type, $query, $limit) {
            $term = "%{$query}%";

            return match ($type) {
                'prayer_requests' => PrayerRequest::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit($limit)
                    ->get(),
                'contact_messages' => ContactMessage::where('subject', 'like', $term)
                    ->limit($limit)
                    ->get(),
                'media' => Media::where('original_filename', 'like', $term)
                    ->limit($limit)
                    ->get(),
                'blogs' => BlogPost::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit($limit)
                    ->get(),
                'sermons' => Sermon::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit($limit)
                    ->get(),
                'songs' => Song::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit($limit)
                    ->get(),
                'events' => Event::where('title', 'like', $term)
                    ->where('status', 'published')
                    ->limit($limit)
                    ->get(),
                'ministries' => Ministry::where('name', 'like', $term)
                    ->where('status', 'published')
                    ->limit($limit)
                    ->get(),
                default => collect(),
            };
        });
    }
}
