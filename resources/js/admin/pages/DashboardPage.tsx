import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Music, BookOpen, Calendar, FileText, Heart,
  MessageCircle, Mail, Activity, Settings,
  ArrowRight, Clock, ChevronRight,
} from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardData, RecentUser, RecentActivity, RecentContentItem } from '../types';

const statCardColors: Record<string, string> = {
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  gray: 'bg-neutral-100 text-neutral-600',
};

const contentTypeMeta: Record<RecentContentItem['type'], { label: string; href: string; icon: React.ReactNode; color: string }> = {
  song: { label: 'Song', href: '/admin/songs', icon: <Music className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
  sermon: { label: 'Sermon', href: '/admin/sermons', icon: <BookOpen className="w-4 h-4" />, color: 'bg-red-50 text-red-600' },
  blog_post: { label: 'Blog Post', href: '/admin/blogs', icon: <FileText className="w-4 h-4" />, color: 'bg-cyan-50 text-cyan-600' },
  event: { label: 'Event', href: '/admin/events', icon: <Calendar className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600' },
  ministry: { label: 'Ministry', href: '/admin/ministries', icon: <Heart className="w-4 h-4" />, color: 'bg-pink-50 text-pink-600' },
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getStats();
      setData(result);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) return <DashboardSkeleton />;
  if (error) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <p className="text-body-base text-neutral-500 mb-4">{error}</p>
        <button onClick={fetchDashboard} className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-body-sm">
          Retry
        </button>
      </div>
    </div>
  );
  if (!data) return null;

  const stats = data.stats;

  const statCards = [
    { title: 'Total Users', value: stats.users.total, icon: <Users className="w-5 h-5" />, color: 'blue', href: '/admin/users' },
    { title: 'Songs', value: stats.content.songs, icon: <Music className="w-5 h-5" />, color: 'purple', href: '/admin/songs' },
    { title: 'Sermons', value: stats.content.sermons, icon: <BookOpen className="w-5 h-5" />, color: 'red', href: '/admin/sermons' },
    { title: 'Events', value: stats.content.events, icon: <Calendar className="w-5 h-5" />, color: 'orange', href: '/admin/events' },
    { title: 'Blog Posts', value: stats.content.blog_posts, icon: <FileText className="w-5 h-5" />, color: 'cyan', href: '/admin/blogs' },
    { title: 'Ministries', value: stats.content.ministries, icon: <Heart className="w-5 h-5" />, color: 'pink', href: '/admin/ministries' },
    { title: 'Prayer Requests', value: stats.content.prayer_requests, icon: <MessageCircle className="w-5 h-5" />, color: 'green', href: '/admin/prayer-requests' },
    { title: 'Contact Messages', value: stats.content.contact_messages, icon: <Mail className="w-5 h-5" />, color: 'gray', href: '/admin/contact-messages' },
  ];

  const quickActions = [
    { title: 'Create Song', icon: <Music className="w-5 h-5" />, href: '/admin/songs', color: 'bg-purple-500' },
    { title: 'Create Sermon', icon: <BookOpen className="w-5 h-5" />, href: '/admin/sermons', color: 'bg-red-500' },
    { title: 'Create Blog Post', icon: <FileText className="w-5 h-5" />, href: '/admin/blogs', color: 'bg-cyan-500' },
    { title: 'Create Event', icon: <Calendar className="w-5 h-5" />, href: '/admin/events', color: 'bg-orange-500' },
    { title: 'Create Ministry', icon: <Heart className="w-5 h-5" />, href: '/admin/ministries', color: 'bg-pink-500' },
    { title: 'Manage Users', icon: <Users className="w-5 h-5" />, href: '/admin/users', color: 'bg-blue-500' },
    { title: 'Church Settings', icon: <Settings className="w-5 h-5" />, href: '/admin/settings', color: 'bg-neutral-700' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-h2 text-neutral-900 font-bold">Dashboard</h1>
        <p className="text-body-base text-neutral-500 mt-1">
          Welcome back. Here's an overview of your church management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="group bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-neutral-300 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-body-xs text-neutral-500 font-medium uppercase tracking-wide">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statCardColors[card.color]}`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-display-md text-neutral-900 font-bold">{card.value}</span>
              <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h5 text-neutral-900 font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border border-neutral-200 hover:shadow-md hover:border-neutral-300 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-body-xs text-neutral-700 font-medium text-center leading-tight">
                {action.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Recent Users + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="text-h6 text-neutral-900 font-semibold">Recent Users</h3>
            <Link to="/admin/users" className="text-body-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.recent_users.length === 0 ? (
              <div className="px-5 py-8 text-center text-body-sm text-neutral-400">No users yet</div>
            ) : (
              data.recent_users.map((user: RecentUser) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-label-md font-bold shrink-0">
                    {user.display_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm text-neutral-900 font-medium truncate">{user.display_name}</p>
                    <p className="text-body-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <span className={`text-body-xs px-2 py-0.5 rounded-full font-medium ${
                    user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="text-h6 text-neutral-900 font-semibold">Recent Activity</h3>
            <Link to="/admin/audit-logs" className="text-body-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.recent_activity.length === 0 ? (
              <div className="px-5 py-8 text-center text-body-sm text-neutral-400">No activity yet</div>
            ) : (
              data.recent_activity.map((activity: RecentActivity) => (
                <div key={activity.id} className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    activity.action === 'login' ? 'bg-blue-50 text-blue-600'
                    : activity.action === 'create' ? 'bg-emerald-50 text-emerald-600'
                    : activity.action === 'update' ? 'bg-amber-50 text-amber-600'
                    : activity.action === 'delete' ? 'bg-red-50 text-red-600'
                    : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm text-neutral-900">
                      <span className="font-medium">{activity.user?.display_name || 'System'}</span>{' '}
                      <span className="text-neutral-500">{activity.action}</span>{' '}
                      {activity.entity && <span className="text-neutral-700">{activity.entity}</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span className="text-body-xs text-neutral-400">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recently Published + Draft Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Published Content */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="text-h6 text-neutral-900 font-semibold">Recently Published Content</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.recently_published.length === 0 ? (
              <div className="px-5 py-8 text-center text-body-sm text-neutral-400">Nothing published yet</div>
            ) : (
              data.recently_published.map((item: RecentContentItem) => {
                const meta = contentTypeMeta[item.type];
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={meta.href}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm text-neutral-900 font-medium truncate">{item.title}</p>
                      <p className="text-body-xs text-neutral-500">{meta.label}</p>
                    </div>
                    {item.date && (
                      <span className="text-body-xs text-neutral-400 shrink-0">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Draft Content */}
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="text-h6 text-neutral-900 font-semibold">Draft Content</h3>
            <span className="text-body-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700">
              {data.draft_content.total} awaiting publish
            </span>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.draft_content.items.length === 0 ? (
              <div className="px-5 py-8 text-center text-body-sm text-neutral-400">No drafts — everything is published</div>
            ) : (
              data.draft_content.items.map((item: RecentContentItem) => {
                const meta = contentTypeMeta[item.type];
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={meta.href}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm text-neutral-900 font-medium truncate">{item.title}</p>
                      <p className="text-body-xs text-neutral-500">{meta.label}</p>
                    </div>
                    {item.date && (
                      <span className="text-body-xs text-neutral-400 shrink-0">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse">
    <div>
      <div className="h-8 w-48 bg-neutral-200 rounded-lg mb-2" />
      <div className="h-5 w-80 bg-neutral-100 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex justify-between mb-4">
            <div className="h-3 w-20 bg-neutral-100 rounded" />
            <div className="w-9 h-9 bg-neutral-100 rounded-lg" />
          </div>
          <div className="h-8 w-16 bg-neutral-200 rounded-lg" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <div className="h-5 w-32 bg-neutral-200 rounded" />
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-100 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-36 bg-neutral-100 rounded" />
                <div className="h-3 w-48 bg-neutral-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default DashboardPage;
