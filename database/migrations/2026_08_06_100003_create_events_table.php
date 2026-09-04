<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->longText('description');
            $table->string('featured_image')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('event_categories')->nullOnDelete();
            $table->string('location')->nullable();
            $table->string('google_map_url')->nullable();
            $table->date('start_date')->index();
            $table->date('end_date')->nullable()->index();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('registration_required')->default(false);
            $table->unsignedInteger('registration_limit')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->enum('status', ['draft', 'published', 'cancelled'])->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'status', 'featured']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
