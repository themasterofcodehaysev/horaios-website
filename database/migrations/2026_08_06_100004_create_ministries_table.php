<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ministries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->string('leader')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('meeting_day')->nullable();
            $table->time('meeting_time')->nullable();
            $table->string('location')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->enum('status', ['draft', 'published'])->default('draft')->index();
            $table->unsignedInteger('display_order')->default(0)->index();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('seo_image')->nullable();
            $table->string('canonical_url')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'featured', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ministries');
    }
};
