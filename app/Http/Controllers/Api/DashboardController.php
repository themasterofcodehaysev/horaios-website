<?php

namespace App\Http\Controllers\Api;

use App\Models\AuditLog;
use App\Models\ChurchSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends BaseApiController
{
    /**
     * GET /api/v1/admin/dashboard
     * Returns real statistics from the database for the admin dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
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

        // Content placeholders (will be replaced by real counts when modules are built)
        $stats = [
            'users' => [
                'total'         => $totalUsers,
                'active'        => $activeUsers,
                'new_this_month'=> $newUsersThisMonth,
                'inactive'      => $totalUsers - $activeUsers,
            ],
            // Placeholder counts — real data when modules are implemented
            'content' => [
                'songs'          => \App\Models\Song::count(),
                'sermons'        => \App\Models\Sermon::count(),
                'events'         => 0,
                'blog_posts'     => 0,
                'ministries'     => 0,
                'prayer_requests'=> 0,
                'contact_messages'=> 0,
            ],
            'activity' => [
                'total_audit_logs' => AuditLog::count(),
                'today'            => AuditLog::whereDate('created_at', today())->count(),
            ],
        ];

        return $this->success([
            'stats'           => $stats,
            'recent_users'    => $recentUsers,
            'recent_activity' => $recentActivity,
        ], 'Dashboard data retrieved');
    }
}
