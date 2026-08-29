<?php

namespace App\Http\Controllers\Api;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\ChurchSetting;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\Ministry;
use App\Models\PrayerRequest;
use App\Models\Sermon;
use App\Models\Song;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class DashboardController extends BaseApiController
{
    /**
     * GET /api/v1/admin/dashboard
     * Returns real statistics from the database for the admin dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        // Cache dashboard data for 10 minutes to improve performance
        $cacheKey = 'dashboard_stats_' . $request->user()->id;
        
        $dashboardData = Cache::remember($cacheKey, 600, function () use ($request) {
            // Core user stats
            $totalUsers = User::count();
            $activeUsers = User::where('status', 'active')->count();
            $newUsersThisMonth = User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            // Recent users
            $recentUsers = User::with('role')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(fn($u) => [
                    'id'           => $u->id,
                    'uuid'         => $u->uuid,
                    'display_name' => $u->display_name,
                    'email'        => $u->email,
                    'avatar'       => $u->avatar,
                    'status'       => $u->status,
                    'role'         => $u->role?->display_name,
                    'created_at'   => $u->created_at?->toIso8601String(),
                ]);

            // Recent audit activity
            $recentActivity = AuditLog::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($log) => [
                    'id'         => $log->id,
                    'action'     => $log->action,
                    'entity'     => $log->entity,
                    'entity_id'  => $log->entity_id,
                    'user'       => $log->user ? [
                        'display_name' => $log->user->display_name,
                        'email'        => $log->user->email,
                    ] : null,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at?->toIso8601String(),
                ]);

            $stats = [
                'users' => [
                    'total'         => $totalUsers,
                    'active'        => $activeUsers,
                    'new_this_month'=> $newUsersThisMonth,
                    'inactive'      => $totalUsers - $activeUsers,
                ],
                'content' => [
                    'songs'          => Song::count(),
                    'sermons'        => Sermon::count(),
                    'events'         => Event::count(),
                    'blog_posts'     => BlogPost::count(),
                    'ministries'     => Ministry::count(),
                    'prayer_requests'=> PrayerRequest::count(),
                    'contact_messages'=> ContactMessage::count(),
                ],
                'activity' => [
                    'total_audit_logs' => AuditLog::count(),
                    'today'            => AuditLog::whereDate('created_at', today())->count(),
                ],
            ];

            // Recently published content, merged across modules and ordered by publish date.
            $recentlyPublished = $this->recentContentByStatus('published', 8);

            // Draft content awaiting publication, merged across modules.
            $draftItems = $this->recentContentByStatus('draft', 8);
            $draftCounts = [
                'songs'      => Song::where('status', 'draft')->count(),
                'sermons'    => Sermon::where('status', 'draft')->count(),
                'blog_posts' => BlogPost::where('status', 'draft')->count(),
                'events'     => Event::where('status', 'draft')->count(),
                'ministries' => Ministry::where('status', 'draft')->count(),
            ];

            return [
                'stats'              => $stats,
                'recent_users'       => $recentUsers,
                'recent_activity'    => $recentActivity,
                'recently_published' => $recentlyPublished,
                'draft_content'      => [
                    'total'   => array_sum($draftCounts),
                    'by_type' => $draftCounts,
                    'items'   => $draftItems,
                ],
            ];
        });

        return $this->success($dashboardData, 'Dashboard data retrieved');
    }

    /**
     * Fetch the N most recent content items (by publish/update recency) across
     * Songs, Sermons, Blog Posts, Events, and Ministries for a given status.
     * Song has no published_at column, so its updated_at is used as a proxy.
     */
    private function recentContentByStatus(string $status, int $limit = 8): Collection
    {
        $dateField = $status === 'published' ? 'published_at' : 'updated_at';

        // Use union query to fetch all content in a single query, then limit
        $query = Song::where('status', $status)
            ->select(['id', 'uuid', 'title', 'updated_at', 'updated_at as date'])
            ->selectRaw("'song' as type")
            ->unionAll(
                Sermon::where('status', $status)
                    ->select(['id', 'uuid', 'title', $dateField, $dateField])
                    ->selectRaw("'sermon' as type")
            )
            ->unionAll(
                BlogPost::where('status', $status)
                    ->select(['id', 'uuid', 'title', $dateField, $dateField])
                    ->selectRaw("'blog_post' as type")
            )
            ->unionAll(
                Event::where('status', $status)
                    ->select(['id', 'uuid', 'title', $dateField, $dateField])
                    ->selectRaw("'event' as type")
            )
            ->unionAll(
                Ministry::where('status', $status)
                    ->select(['id', 'uuid', 'name as title', $dateField, $dateField])
                    ->selectRaw("'ministry' as type")
            )
            ->orderBy('date', 'desc')
            ->limit($limit);

        $items = $query->get()->map(fn($m) => [
            'type'  => $m->type,
            'id'    => $m->id,
            'uuid'  => $m->uuid,
            'title' => $m->title,
            'date'  => $m->date?->toIso8601String(),
        ]);

        return $items;
    }
}
