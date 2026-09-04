<?php

namespace Database\Factories;

use App\Models\Sermon;
use App\Models\SermonCategory;
use App\Models\SermonSeries;
use App\Models\Speaker;
use Illuminate\Database\Eloquent\Factories\Factory;

class SermonFactory extends Factory
{
    protected $model = Sermon::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'summary' => fake()->paragraph(),
            'description' => fake()->paragraphs(2, true),
            'speaker_id' => Speaker::factory(),
            'series_id' => SermonSeries::factory(),
            'category_id' => SermonCategory::factory(),
            'scripture_reference' => 'John 3:16',
            'youtube_url' => 'https://www.youtube.com/watch?v=sample',
            'thumbnail' => '/storage/uploads/sermons/sample.jpg',
            'featured' => false,
            'status' => 'published',
            'published_at' => now(),
            'display_order' => 1,
        ];
    }
}
