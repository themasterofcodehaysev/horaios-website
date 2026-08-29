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

export interface RecentContentItem {
  type: 'song' | 'sermon' | 'blog_post' | 'event' | 'ministry';
  id: number;
  uuid: string;
  title: string;
  date: string | null;
}

export interface DraftContentSummary {
  total: number;
  by_type: {
    songs: number;
    sermons: number;
    blog_posts: number;
    events: number;
    ministries: number;
  };
  items: RecentContentItem[];
}

export interface DashboardData {
  stats: DashboardStats;
  recent_users: RecentUser[];
  recent_activity: RecentActivity[];
  recently_published: RecentContentItem[];
  draft_content: DraftContentSummary;
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

// ============================================================
// Prayer Requests Module Types
// ============================================================

export interface PrayerRequest {
  id: number;
  uuid: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string;
  request: string;
  request_type: 'general' | 'healing' | 'guidance' | 'thanksgiving' | 'emergency';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  allow_public_prayer: boolean;
  is_anonymous: boolean;
  status: 'pending' | 'reviewed' | 'praying' | 'completed' | 'archived';
  admin_notes: string | null;
  processed_by: { id: number; display_name: string } | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePrayerRequestPayload {
  name: string;
  email?: string;
  phone?: string;
  title: string;
  request: string;
  request_type?: 'general' | 'healing' | 'guidance' | 'thanksgiving' | 'emergency';
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  allow_public_prayer?: boolean;
  is_anonymous?: boolean;
}

export interface UpdatePrayerRequestPayload {
  status?: 'pending' | 'reviewed' | 'praying' | 'completed' | 'archived';
  admin_notes?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  allow_public_prayer?: boolean;
}

export interface PrayerRequestFilters {
  search?: string;
  status?: string;
  request_type?: string;
  urgency?: string;
  allow_public_prayer?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface PrayerRequestStats {
  total: number;
  pending: number;
  reviewed: number;
  praying: number;
  completed: number;
  archived: number;
  urgent: number;
  public: number;
}

// ============================================================
// Contact Messages Module Types
// ============================================================

export interface ContactMessage {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  admin_notes: string | null;
  replied_by: { id: number; display_name: string } | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateContactMessagePayload {
  status?: 'unread' | 'read' | 'replied' | 'archived';
  admin_notes?: string;
}

export interface ContactMessageFilters {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface ContactMessageStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

// ============================================================
// Media Library Module Types
// ============================================================

export interface MediaItem {
  id: number;
  uuid: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  extension: string;
  size: number;
  size_formatted: string;
  width: number | null;
  height: number | null;
  disk: string;
  path: string;
  url: string;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: { id: number; display_name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateMediaPayload {
  alt_text?: string;
  caption?: string;
}

export interface MediaFilters {
  search?: string;
  mime_type?: string;
  uploaded_by?: number;
  page?: number;
  per_page?: number;
}

export interface MediaStats {
  total: number;
  images: number;
  documents: number;
  videos: number;
  audio: number;
  total_size: number;
}

// ============================================================
// Notification Center Types
// ============================================================

export interface Notification {
  id: number;
  uuid: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  link: string | null;
  is_read?: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationStats {
  count: number;
  unread_count: number;
}

// ============================================================
// Navigation/Menu Management Types
// ============================================================

export interface NavigationMenu {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  location: 'header' | 'footer' | 'quick_links';
  description: string | null;
  is_active: boolean;
  display_order: number;
  items: NavigationMenuItem[];
  created_at: string;
  updated_at: string;
}

export interface NavigationMenuItem {
  id: number;
  uuid: string;
  menu_id: number;
  parent_id: number | null;
  label: string;
  url: string;
  is_external: boolean;
  open_in_new_tab: boolean;
  is_active: boolean;
  display_order: number;
  icon: string | null;
  children: NavigationMenuItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateNavigationMenuPayload {
  name: string;
  location: 'header' | 'footer' | 'quick_links';
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateNavigationMenuPayload {
  name?: string;
  location?: 'header' | 'footer' | 'quick_links';
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface CreateNavigationMenuItemPayload {
  menu_id: number;
  parent_id?: number | null;
  label: string;
  url: string;
  is_external?: boolean;
  open_in_new_tab?: boolean;
  is_active?: boolean;
  display_order?: number;
  icon?: string;
}

export interface UpdateNavigationMenuItemPayload {
  label?: string;
  url?: string;
  is_external?: boolean;
  open_in_new_tab?: boolean;
  is_active?: boolean;
  display_order?: number;
  icon?: string;
}

// ============================================================
// Homepage CMS Types
// ============================================================

export interface HomepageSection {
  id: number;
  uuid: string;
  key: string;
  title: string;
  content: string | null;
  data: Record<string, unknown> | null;
  is_visible: boolean;
  display_order: number;
  background_image: string | null;
  background_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHomepageSectionPayload {
  key: string;
  title: string;
  content?: string;
  data?: Record<string, unknown>;
  is_visible?: boolean;
  display_order?: number;
  background_image?: string;
  background_color?: string;
}

export interface UpdateHomepageSectionPayload {
  title?: string;
  content?: string;
  data?: Record<string, unknown>;
  is_visible?: boolean;
  display_order?: number;
  background_image?: string;
  background_color?: string;
}

// ============================================================
// Footer Management Types
// ============================================================

export interface FooterSetting {
  id: number;
  uuid: string;
  key: string;
  value: string | null;
  type: 'text' | 'image' | 'html' | 'json' | 'boolean' | 'integer';
  group: 'general' | 'social' | 'contact' | 'links';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFooterSettingPayload {
  key: string;
  value?: string;
  type: 'text' | 'image' | 'html' | 'json' | 'boolean' | 'integer';
  group: 'general' | 'social' | 'contact' | 'links';
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateFooterSettingPayload {
  value?: string;
  is_active?: boolean;
  display_order?: number;
}

// ============================================================
// Search Types
// ============================================================

interface PrayerRequestSearchItem {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface ContactMessageSearchItem {
  id: number;
  subject: string;
  status: string;
  created_at: string;
}

interface MediaSearchItem {
  id: number;
  original_filename: string;
  mime_type: string;
  created_at: string;
}

interface BlogSearchItem {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface SermonSearchItem {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface SongSearchItem {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface EventSearchItem {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface MinistrySearchItem {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

type SearchItem = PrayerRequestSearchItem | ContactMessageSearchItem | MediaSearchItem | BlogSearchItem | SermonSearchItem | SongSearchItem | EventSearchItem | MinistrySearchItem;

export interface SearchResult {
  prayer_requests?: PrayerRequestSearchItem[];
  contact_messages?: ContactMessageSearchItem[];
  media?: MediaSearchItem[];
  blogs?: BlogSearchItem[];
  sermons?: SermonSearchItem[];
  songs?: SongSearchItem[];
  events?: EventSearchItem[];
  ministries?: MinistrySearchItem[];
}

