<?php

namespace Database\Factories;

use App\Models\MinistryCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class MinistryCategoryFactory extends Factory
{
    protected $model = MinistryCategory::class;

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
