import type React from 'react';

export type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning';
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type Align = 'left' | 'center' | 'right';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  link?: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  series?: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  image?: string;
  tags?: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics?: string;
  audioUrl?: string;
  duration: string;
  album?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  slug: string;
  tags?: string[];
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader?: string;
  image?: string;
  members?: number;
  meetingSchedule?: string;
  icon?: React.ReactNode;
}

export interface ServiceTime {
  day: string;
  time: string;
  type: string;
  location?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface DonationLevel {
  amount: number;
  label: string;
}

export interface ChurchInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  serviceTimes: ServiceTime[];
  about: string;
  vision: string;
  mission: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginatedMeta;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PublicUserStub {
  id: number;
  display_name: string;
  avatar?: string | null;
}

export interface BlogCategoryPublic {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order?: number;
  blog_posts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPostPublic {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category_id: number | null;
  category: BlogCategoryPublic | null;
  created_by: number | null;
  author: PublicUserStub | null;
  featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogFilters {
  search?: string;
  category_slug?: string;
  featured?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface EventCategoryPublic {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order?: number;
  events_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type EventStatus = 'upcoming' | 'today' | 'ongoing' | 'cancelled' | 'completed';

export interface EventPublic {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  description: string | null;
  featured_image: string | null;
  category_id: number | null;
  category: EventCategoryPublic | null;
  location: string | null;
  google_map_url: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  registration_required: boolean;
  registration_limit: number | null;
  registrations_count?: number;
  featured: boolean;
  status: 'published' | 'cancelled';
  event_status?: EventStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  search?: string;
  category_slug?: string;
  featured?: boolean | string;
  start_date_from?: string;
  start_date_to?: string;
  scope?: 'upcoming' | 'past' | 'all';
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface MinistryCategoryPublic {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  display_order?: number;
  ministries_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MinistryPublic {
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
  category: MinistryCategoryPublic | null;
  meeting_day: string | null;
  meeting_time: string | null;
  location: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MinistryFilters {
  search?: string;
  category_slug?: string;
  featured?: boolean | string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

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
