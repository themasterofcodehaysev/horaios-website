<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sermons', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->foreignId('speaker_id')->nullable()->constrained('speakers')->nullOnDelete();
            $table->foreignId('series_id')->nullable()->constrained('sermon_series')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('sermon_categories')->nullOnDelete();
            $table->string('scripture_reference')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('video_file')->nullable();
            $table->string('audio_file')->nullable();
            $table->string('thumbnail')->nullable();
            $table->boolean('featured')->default(false);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'featured', 'published_at']);
            $table->index(['speaker_id', 'series_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sermons');
    }
};
