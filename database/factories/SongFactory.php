<?php

namespace Database\Factories;

use App\Models\Song;
use App\Models\SongCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class SongFactory extends Factory
{
    protected $model = Song::class;

    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'artist' => fake()->name(),
            'composer' => fake()->name(),
            'category_id' => SongCategory::factory(),
            'lyrics' => "Line 1 of praise song\nLine 2 of worship\nHallelujah",
            'featured' => false,
            'status' => 'published',
            'display_order' => 1,
        ];
    }
}
