<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\ChurchService;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\Ministry;
use App\Models\PrayerRequest;
use App\Models\Sermon;
use App\Models\Song;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class SearchService
{
    public function globalSearch(string $query, ?string $type = null): array
    {
        $results = [];
        $term = "%{$query}%";

        if (!$type || $type === 'songs') {
            $results['songs'] = Song::where('title', 'like', $term)
                ->orWhere('artist', 'like', $term)
                ->limit(5)
                ->get(['id', 'title', 'artist', 'status', 'created_at']);
        }

        if (!$type || $type === 'sermons') {
            $results['sermons'] = Sermon::where('title', 'like', $term)
                ->limit(5)
                ->get(['id', 'title', 'status', 'created_at']);
        }

        if (!$type || $type === 'blogs') {
            $results['blogs'] = BlogPost::where('title', 'like', $term)
                ->limit(5)
                ->get(['id', 'title', 'status', 'created_at']);
        }

        if (!$type || $type === 'events') {
            $results['events'] = Event::where('title', 'like', $term)
                ->limit(5)
                ->get(['id', 'title', 'status', 'created_at']);
        }

        if (!$type || $type === 'ministries') {
            $results['ministries'] = Ministry::where('name', 'like', $term)
                ->limit(5)
                ->get(['id', 'name', 'status', 'created_at']);
        }

        if (!$type || $type === 'services') {
            $results['services'] = ChurchService::where('title', 'like', $term)
                ->orWhere('day', 'like', $term)
                ->orWhere('type', 'like', $term)
                ->limit(5)
                ->get(['id', 'title', 'day', 'time', 'status', 'created_at']);
        }

        if (!$type || $type === 'users') {
            $results['users'] = User::where('first_name', 'like', $term)
                ->orWhere('last_name', 'like', $term)
                ->orWhere('display_name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->limit(5)
                ->get(['id', 'first_name', 'last_name', 'display_name', 'email', 'created_at']);
        }

        if (!$type || $type === 'prayer_requests') {
            $results['prayer_requests'] = PrayerRequest::where('title', 'like', $term)
                ->limit(5)
                ->get(['id', 'title', 'status', 'created_at']);
        }

        if (!$type || $type === 'contact_messages') {
            $results['contact_messages'] = ContactMessage::where('subject', 'like', $term)
                ->orWhere('name', 'like', $term)
                ->limit(5)
                ->get(['id', 'subject', 'name', 'status', 'created_at']);
        }

        return $results;
    }

    public function searchByType(string $type, string $query, int $limit = 20): Collection
    {
        $term = "%{$query}%";

        return match ($type) {
            'songs' => Song::where('title', 'like', $term)
                ->orWhere('artist', 'like', $term)
                ->limit($limit)
                ->get(),
            'sermons' => Sermon::where('title', 'like', $term)
                ->limit($limit)
                ->get(),
            'blogs' => BlogPost::where('title', 'like', $term)
                ->limit($limit)
                ->get(),
            'events' => Event::where('title', 'like', $term)
                ->limit($limit)
                ->get(),
            'ministries' => Ministry::where('name', 'like', $term)
                ->limit($limit)
                ->get(),
            'services' => ChurchService::where('title', 'like', $term)
                ->orWhere('day', 'like', $term)
                ->orWhere('type', 'like', $term)
                ->limit($limit)
                ->get(),
            'users' => User::where('first_name', 'like', $term)
                ->orWhere('last_name', 'like', $term)
                ->orWhere('display_name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->limit($limit)
                ->get(),
            'prayer_requests' => PrayerRequest::where('title', 'like', $term)
                ->limit($limit)
                ->get(),
            'contact_messages' => ContactMessage::where('subject', 'like', $term)
                ->orWhere('name', 'like', $term)
                ->limit($limit)
                ->get(),
            default => collect(),
        };
    }
}
