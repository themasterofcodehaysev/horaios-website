<?php

namespace Database\Factories;

use App\Models\SermonCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class SermonCategoryFactory extends Factory
{
    protected $model = SermonCategory::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'display_order' => fake()->numberBetween(1, 10),
            'status' => 'active',
        ];
    }
}
