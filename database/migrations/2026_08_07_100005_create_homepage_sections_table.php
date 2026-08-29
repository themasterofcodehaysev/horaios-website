<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage_sections', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('key')->unique(); // hero, welcome, about, etc.
            $table->string('title');
            $table->text('content')->nullable();
            $table->json('data')->nullable(); // For structured data like images, buttons, etc.
            $table->boolean('is_visible')->default(true)->index();
            $table->integer('display_order')->default(0)->index();
            $table->string('background_image')->nullable();
            $table->string('background_color')->nullable();
            $table->timestamps();

            $table->index(['is_visible', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_sections');
    }
};
