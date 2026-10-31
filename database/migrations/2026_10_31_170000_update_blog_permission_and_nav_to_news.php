<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('permissions')
            ->where('name', 'blog.manage')
            ->update([
                'display_name' => 'Manage News',
                'updated_at'   => now(),
            ]);

        DB::table('navigation_menu_items')
            ->where('label', 'Blog')
            ->update([
                'label'      => 'News',
                'url'        => '/news',
                'updated_at' => now(),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')
            ->where('name', 'blog.manage')
            ->update([
                'display_name' => 'Manage Blog',
                'updated_at'   => now(),
            ]);

        DB::table('navigation_menu_items')
            ->where('label', 'News')
            ->where('url', '/news')
            ->update([
                'label'      => 'Blog',
                'url'        => '/blog',
                'updated_at' => now(),
            ]);
    }
};
