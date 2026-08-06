<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ministries', function (Blueprint $table) {
            $table->foreignId('category_id')
                ->nullable()
                ->after('featured_image')
                ->constrained('ministry_categories')
                ->nullOnDelete();
            $table->timestamp('published_at')->nullable()->after('status')->index();

            $table->index(['category_id', 'status', 'featured']);
        });
    }

    public function down(): void
    {
        Schema::table('ministries', function (Blueprint $table) {
            $table->dropIndex(['category_id', 'status', 'featured']);
            $table->dropConstrainedForeignId('category_id');
            $table->dropColumn('published_at');
        });
    }
};
