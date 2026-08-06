<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('filename');
            $table->string('original_filename');
            $table->string('mime_type')->index();
            $table->string('extension', 10)->index();
            $table->unsignedBigInteger('size'); // in bytes
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('url');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
