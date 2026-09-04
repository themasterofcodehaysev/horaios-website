<?php

namespace Database\Factories;

use App\Models\SermonSeries;
use Illuminate\Database\Eloquent\Factories\Factory;

class SermonSeriesFactory extends Factory
{
    protected $model = SermonSeries::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'thumbnail' => '/storage/uploads/sermons/series-sample.jpg',
            'display_order' => 1,
            'status' => 'active',
        ];
    }
}
