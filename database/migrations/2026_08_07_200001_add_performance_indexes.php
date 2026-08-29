<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Prayer requests indexes
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'idx_prayer_status_created');
            $table->index('urgency', 'idx_prayer_urgency');
            $table->index(['is_anonymous', 'created_at'], 'idx_prayer_anonymous_created');
        });

        // Contact messages indexes
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'idx_contact_status_created');
        });

        // Media indexes
        Schema::table('media', function (Blueprint $table) {
            $table->index(['mime_type', 'uploaded_by'], 'idx_media_type_uploader');
            $table->index('created_at', 'idx_media_created');
            $table->index(['mime_type', 'created_at'], 'idx_media_type_created');
        });

        // Notifications indexes
        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['user_id', 'is_read', 'created_at'], 'idx_notif_user_read_created');
            $table->index(['is_read', 'created_at'], 'idx_notif_read_created');
        });

        // Navigation menu items indexes
        Schema::table('navigation_menu_items', function (Blueprint $table) {
            $table->index(['menu_id', 'display_order'], 'idx_nav_menu_order');
            $table->index(['menu_id', 'parent_id', 'display_order'], 'idx_nav_menu_parent_order');
            $table->index(['menu_id', 'is_active', 'display_order'], 'idx_nav_menu_active_order');
        });

        // Homepage sections indexes
        Schema::table('homepage_sections', function (Blueprint $table) {
            $table->index(['is_visible', 'display_order'], 'idx_homepage_visible_order');
            $table->index('key', 'idx_homepage_key');
        });

        // Footer settings indexes
        Schema::table('footer_settings', function (Blueprint $table) {
            $table->index(['group', 'is_active'], 'idx_footer_group_active');
            $table->index('key', 'idx_footer_key');
        });

        // Blog posts indexes
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'idx_blog_status_created');
            $table->index(['featured', 'created_at'], 'idx_blog_featured_created');
            $table->index('slug', 'idx_blog_slug');
        });

        // Sermons indexes
        Schema::table('sermons', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'idx_sermon_status_created');
            $table->index(['featured', 'created_at'], 'idx_sermon_featured_created');
        });

        // Events indexes
        Schema::table('events', function (Blueprint $table) {
            $table->index(['status', 'start_date'], 'idx_event_status_date');
            $table->index(['featured', 'start_date'], 'idx_event_featured_date');
        });

        // Ministries indexes
        Schema::table('ministries', function (Blueprint $table) {
            $table->index(['status', 'display_order'], 'idx_ministry_status_order');
            $table->index(['featured', 'display_order'], 'idx_ministry_featured_order');
        });
    }

    public function down(): void
    {
        // Prayer requests indexes
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->dropIndex('idx_prayer_status_created');
            $table->dropIndex('idx_prayer_urgency');
            $table->dropIndex('idx_prayer_anonymous_created');
        });

        // Contact messages indexes
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex('idx_contact_status_created');
        });

        // Media indexes
        Schema::table('media', function (Blueprint $table) {
            $table->dropIndex('idx_media_type_uploader');
            $table->dropIndex('idx_media_created');
            $table->dropIndex('idx_media_type_created');
        });

        // Notifications indexes
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('idx_notif_user_read_created');
            $table->dropIndex('idx_notif_read_created');
        });

        // Navigation menu items indexes
        Schema::table('navigation_menu_items', function (Blueprint $table) {
            $table->dropIndex('idx_nav_menu_order');
            $table->dropIndex('idx_nav_menu_parent_order');
            $table->dropIndex('idx_nav_menu_active_order');
        });

        // Homepage sections indexes
        Schema::table('homepage_sections', function (Blueprint $table) {
            $table->dropIndex('idx_homepage_visible_order');
            $table->dropIndex('idx_homepage_key');
        });

        // Footer settings indexes
        Schema::table('footer_settings', function (Blueprint $table) {
            $table->dropIndex('idx_footer_group_active');
            $table->dropIndex('idx_footer_key');
        });

        // Blog posts indexes
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex('idx_blog_status_created');
            $table->dropIndex('idx_blog_featured_created');
            $table->dropIndex('idx_blog_slug');
        });

        // Sermons indexes
        Schema::table('sermons', function (Blueprint $table) {
            $table->dropIndex('idx_sermon_status_created');
            $table->dropIndex('idx_sermon_featured_created');
        });

        // Events indexes
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('idx_event_status_date');
            $table->dropIndex('idx_event_featured_date');
        });

        // Ministries indexes
        Schema::table('ministries', function (Blueprint $table) {
            $table->dropIndex('idx_ministry_status_order');
            $table->dropIndex('idx_ministry_featured_order');
        });
    }
};
