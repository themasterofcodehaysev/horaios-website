// ============================================================
// Admin TypeScript Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface AuthUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: 'active' | 'inactive' | 'locked';
  role: Role | null;
  email_verified_at: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  users_count?: number;
  is_system?: boolean;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  group: string;
}

export interface User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: 'active' | 'inactive' | 'locked';
  role: Role | null;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SongCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  songs_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SongItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  artist: string | null;
  composer: string | null;
  category_id: number | null;
  category: SongCategory | null;
  lyrics: string;
  featured: boolean;
  status: 'draft' | 'published';
  display_order: number;
  created_by: User | null;
  updated_by: User | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSongPayload {
  title: string;
  slug?: string;
  artist?: string;
  composer?: string;
  category_id?: number | null;
  lyrics: string;
  featured?: boolean;
  status: 'draft' | 'published';
  display_order?: number;
}

export interface UpdateSongPayload {
  title?: string;
  slug?: string;
  artist?: string;
  composer?: string;
  category_id?: number | null;
  lyrics?: string;
  featured?: boolean;
  status?: 'draft' | 'published';
  display_order?: number;
}

export interface SongFilters {
  search?: string;
  category_id?: number | string;
  category_slug?: string;
  status?: string;
  featured?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface AuditLog {
  id: number;
  user: { id: number; display_name: string; email: string } | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ChurchSetting {
  id: number;
  key: string;
  value: string | null;
  type: string;
  group: string;
  label: string | null;
  description: string | null;
  is_public: boolean;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    inactive: number;
  };
  content: {
    songs: number;
    sermons: number;
    events: number;
    blog_posts: number;
    ministries: number;
    prayer_requests: number;
    contact_messages: number;
  };
  activity: {
    total_audit_logs: number;
    today: number;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recent_users: RecentUser[];
  recent_activity: RecentActivity[];
}

export interface RecentUser {
  id: number;
  uuid: string;
  display_name: string;
  email: string;
  avatar: string | null;
  status: string;
  role: string | null;
  created_at: string;
}

export interface RecentActivity {
  id: number;
  action: string;
  entity: string | null;
  entity_id: string | null;
  user: { display_name: string; email: string } | null;
  ip_address: string | null;
  created_at: string;
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
  children?: SidebarNavItem[];
  permission?: string;
  badge?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role_id: number;
  status: 'active' | 'inactive';
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role_id?: number;
  status?: 'active' | 'inactive' | 'locked';
}

export interface UserFilters {
  search?: string;
  role_id?: number;
  status?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// ============================================================
// Sermons Module Types
// ============================================================

export interface Speaker {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  photo: string | null;
  biography: string | null;
  position: string | null;
  email: string | null;
  facebook: string | null;
  status: 'active' | 'inactive';
  display_order: number;
  sermons_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SermonSeries {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  sermons_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SermonCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  sermons_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SermonItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  scripture_reference: string | null;
  youtube_url: string | null;
  video_file?: string | null;
  audio_file?: string | null;
  thumbnail: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  display_order: number;
  speaker_id: number | null;
  series_id: number | null;
  category_id: number | null;
  speaker: Speaker | null;
  series: SermonSeries | null;
  category: SermonCategory | null;
  created_by: User | null;
  updated_by: User | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSermonPayload {
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  speaker_id?: number | null;
  series_id?: number | null;
  category_id?: number | null;
  scripture_reference?: string;
  youtube_url?: string;
  video_file?: string;
  audio_file?: string;
  thumbnail?: string;
  featured?: boolean;
  status: 'draft' | 'published';
  published_at?: string | null;
  display_order?: number;
}

export interface UpdateSermonPayload extends Partial<CreateSermonPayload> {}

export interface SermonFilters {
  search?: string;
  speaker_id?: number | string;
  series_id?: number | string;
  category_id?: number | string;
  category_slug?: string;
  status?: string;
  featured?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// ============================================================
// Blog Module Types
// ============================================================

export interface BlogCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  posts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category_id: number | null;
  featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  category: BlogCategory | null;
  created_by: User | null;
  updated_by: User | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPayload {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id?: number | null;
  featured?: boolean;
  status: 'draft' | 'published';
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  canonical_url?: string;
}

export interface UpdateBlogPayload extends Partial<CreateBlogPayload> {}

export interface BlogFilters {
  search?: string;
  category_id?: number | string;
  category_slug?: string;
  status?: string;
  featured?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// ============================================================
// Events Module Types
// ============================================================

export interface EventCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  events_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  description: string | null;
  featured_image: string | null;
  category_id: number | null;
  location: string | null;
  google_map_url: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  registration_required: boolean;
  registration_limit: number | null;
  featured: boolean;
  status: 'draft' | 'published' | 'cancelled';
  event_status?: 'upcoming' | 'today' | 'ongoing' | 'completed' | 'cancelled';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  category: EventCategory | null;
  created_by: User | null;
  updated_by: User | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  title: string;
  slug?: string;
  description?: string;
  featured_image?: string;
  category_id?: number | null;
  location?: string;
  google_map_url?: string;
  start_date: string;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  registration_required?: boolean;
  registration_limit?: number | null;
  featured?: boolean;
  status: 'draft' | 'published' | 'cancelled';
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  canonical_url?: string;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

export interface EventFilters {
  search?: string;
  category_id?: number | string;
  category_slug?: string;
  status?: string;
  featured?: boolean | string;
  start_date_from?: string;
  start_date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

// ============================================================
// Ministries Module Types
// ============================================================

export interface MinistryCategory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  ministries_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MinistryItem {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  leader: string | null;
  email: string | null;
  phone: string | null;
  featured_image: string | null;
  category_id: number | null;
  meeting_day: string | null;
  meeting_time: string | null;
  location: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  display_order: number;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  category: MinistryCategory | null;
  created_by: User | null;
  updated_by: User | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMinistryPayload {
  name: string;
  slug?: string;
  description?: string;
  leader?: string;
  email?: string;
  phone?: string;
  featured_image?: string;
  category_id?: number | null;
  meeting_day?: string;
  meeting_time?: string;
  location?: string;
  featured?: boolean;
  status: 'draft' | 'published';
  display_order?: number;
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  canonical_url?: string;
}

export interface UpdateMinistryPayload extends Partial<CreateMinistryPayload> {}

export interface MinistryFilters {
  search?: string;
  category_id?: number | string;
  category_slug?: string;
  status?: string;
  featured?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

