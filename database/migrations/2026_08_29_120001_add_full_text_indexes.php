<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->index(['title', 'status'], 'blog_search_index');
        });

        Schema::table('sermons', function (Blueprint $table) {
            $table->index(['title', 'status'], 'sermon_search_index');
        });

        Schema::table('songs', function (Blueprint $table) {
            $table->index(['title', 'status'], 'song_search_index');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->index(['title', 'status'], 'event_search_index');
        });

        Schema::table('ministries', function (Blueprint $table) {
            $table->index(['name', 'status'], 'ministry_search_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index(['first_name', 'last_name', 'email'], 'user_search_index');
        });

        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->index(['title', 'status'], 'prayer_search_index');
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index(['subject', 'status'], 'contact_search_index');
        });
    }

    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex('blog_search_index');
        });

        Schema::table('sermons', function (Blueprint $table) {
            $table->dropIndex('sermon_search_index');
        });

        Schema::table('songs', function (Blueprint $table) {
            $table->dropIndex('song_search_index');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('event_search_index');
        });

        Schema::table('ministries', function (Blueprint $table) {
            $table->dropIndex('ministry_search_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('user_search_index');
        });

        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->dropIndex('prayer_search_index');
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex('contact_search_index');
        });
    }
};
