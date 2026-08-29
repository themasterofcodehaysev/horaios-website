<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('key')->unique(); // logo, description, copyright, etc.
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, image, html, json
            $table->string('group')->default('general'); // general, social, links, contact
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['group', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
