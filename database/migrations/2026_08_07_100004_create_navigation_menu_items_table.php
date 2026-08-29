<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_menu_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('menu_id')->constrained('navigation_menus')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('navigation_menu_items')->nullOnDelete();
            $table->string('label');
            $table->string('url');
            $table->boolean('is_external')->default(false);
            $table->boolean('open_in_new_tab')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->integer('display_order')->default(0);
            $table->string('icon')->nullable();
            $table->timestamps();

            $table->index(['menu_id', 'parent_id', 'display_order']);
            $table->index(['menu_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_menu_items');
    }
};
