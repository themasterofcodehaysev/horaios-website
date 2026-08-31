<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add full-text indexes for search optimization
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->index(['title', 'status'], 'blog_search_index');
            $table->index('status');
            $table->index('published_at');
        });

        Schema::table('sermons', function (Blueprint $table) {
            $table->index(['title', 'status'], 'sermon_search_index');
            $table->index('status');
            $table->index('published_at');
            $table->index('speaker_id');
            $table->index('series_id');
            $table->index('category_id');
        });

        Schema::table('songs', function (Blueprint $table) {
            $table->index(['title', 'status'], 'song_search_index');
            $table->index('status');
            $table->index('category_id');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->index(['title', 'status'], 'event_search_index');
            $table->index('status');
            $table->index('start_date');
            $table->index('category_id');
        });

        Schema::table('ministries', function (Blueprint $table) {
            $table->index(['name', 'status'], 'ministry_search_index');
            $table->index('status');
            $table->index('category_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index(['first_name', 'last_name', 'email'], 'user_search_index');
            $table->index('status');
            $table->index('role_id');
        });

        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->index(['title', 'status'], 'prayer_search_index');
            $table->index('status');
            $table->index('urgency');
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index(['subject', 'status'], 'contact_search_index');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex('blog_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['published_at']);
        });

        Schema::table('sermons', function (Blueprint $table) {
            $table->dropIndex('sermon_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['speaker_id']);
            $table->dropIndex(['series_id']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('songs', function (Blueprint $table) {
            $table->dropIndex('song_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('event_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['start_date']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('ministries', function (Blueprint $table) {
            $table->dropIndex('ministry_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('user_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['role_id']);
        });

        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->dropIndex('prayer_search_index');
            $table->dropIndex(['status']);
            $table->dropIndex(['urgency']);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex('contact_search_index');
            $table->dropIndex(['status']);
        });
    }
};
