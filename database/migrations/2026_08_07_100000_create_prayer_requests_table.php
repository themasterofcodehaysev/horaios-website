<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prayer_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('title');
            $table->text('request');
            $table->enum('request_type', ['general', 'healing', 'guidance', 'thanksgiving', 'emergency'])->default('general');
            $table->enum('urgency', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->boolean('allow_public_prayer')->default(false);
            $table->boolean('is_anonymous')->default(false);
            $table->enum('status', ['pending', 'reviewed', 'praying', 'completed', 'archived'])->default('pending')->index();
            $table->text('admin_notes')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'urgency']);
            $table->index(['allow_public_prayer', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prayer_requests');
    }
};
