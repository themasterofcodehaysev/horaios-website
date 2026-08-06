<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('songs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('artist')->nullable()->index();
            $table->string('composer')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('song_categories')->nullOnDelete();
            $table->longText('lyrics');
            $table->boolean('featured')->default(false)->index();
            $table->enum('status', ['draft', 'published'])->default('published')->index();
            $table->integer('display_order')->default(0)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('songs');
    }
};
