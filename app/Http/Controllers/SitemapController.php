<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Event;
use App\Models\Ministry;
use App\Models\Sermon;
use App\Models\Song;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function index(): Response
    {
        return response()->view('sitemap.index')->header('Content-Type', 'text/xml');
    }

    public function main(): Response
    {
        $sitemap = Cache::remember('sitemap_main', 3600, function () {
            $pages = [
                [
                    'loc' => route('home'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'daily',
                    'priority' => '1.0',
                ],
                [
                    'loc' => route('about'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'monthly',
                    'priority' => '0.8',
                ],
                [
                    'loc' => route('ministries'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.9',
                ],
                [
                    'loc' => route('sermons'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.9',
                ],
                [
                    'loc' => route('songs'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.9',
                ],
                [
                    'loc' => route('events'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'daily',
                    'priority' => '0.9',
                ],
                [
                    'loc' => route('news'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'daily',
                    'priority' => '0.8',
                ],
                [
                    'loc' => route('visit'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'monthly',
                    'priority' => '0.7',
                ],
                [
                    'loc' => route('contact'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ],
                [
                    'loc' => route('prayer'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ],
                [
                    'loc' => route('give'),
                    'lastmod' => now()->toIso8601String(),
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ],
            ];

            return $pages;
        });

        return response()->view('sitemap.main', ['pages' => $sitemap])->header('Content-Type', 'text/xml');
    }

    public function sermons(): Response
    {
        $sermons = Cache::remember('sitemap_sermons', 3600, function () {
            return Sermon::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($sermon) {
                    return [
                        'loc' => route('sermons.show', $sermon->identifier),
                        'lastmod' => $sermon->updated_at->toIso8601String(),
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                });
        });

        return response()->view('sitemap.items', ['items' => $sermons])->header('Content-Type', 'text/xml');
    }

    public function songs(): Response
    {
        $songs = Cache::remember('sitemap_songs', 3600, function () {
            return Song::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($song) {
                    return [
                        'loc' => route('songs.show', $song->identifier),
                        'lastmod' => $song->updated_at->toIso8601String(),
                        'changefreq' => 'weekly',
                        'priority' => '0.7',
                    ];
                });
        });

        return response()->view('sitemap.items', ['items' => $songs])->header('Content-Type', 'text/xml');
    }

    public function blog(): Response
    {
        $posts = Cache::remember('sitemap_blog', 3600, function () {
            return BlogPost::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($post) {
                    return [
                        'loc' => route('blog.show', $post->slug),
                        'lastmod' => $post->updated_at->toIso8601String(),
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                });
        });

        return response()->view('sitemap.items', ['items' => $posts])->header('Content-Type', 'text/xml');
    }

    public function events(): Response
    {
        $events = Cache::remember('sitemap_events', 3600, function () {
            return Event::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($event) {
                    return [
                        'loc' => route('events.show', $event->identifier),
                        'lastmod' => $event->updated_at->toIso8601String(),
                        'changefreq' => 'daily',
                        'priority' => '0.7',
                    ];
                });
        });

        return response()->view('sitemap.items', ['items' => $events])->header('Content-Type', 'text/xml');
    }

    public function ministries(): Response
    {
        $ministries = Cache::remember('sitemap_ministries', 3600, function () {
            return Ministry::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($ministry) {
                    return [
                        'loc' => route('ministries.show', $ministry->identifier),
                        'lastmod' => $ministry->updated_at->toIso8601String(),
                        'changefreq' => 'monthly',
                        'priority' => '0.7',
                    ];
                });
        });

        return response()->view('sitemap.items', ['items' => $ministries])->header('Content-Type', 'text/xml');
    }
}
