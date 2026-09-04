<?php

namespace Database\Factories;

use App\Models\Ministry;
use App\Models\MinistryCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class MinistryFactory extends Factory
{
    protected $model = Ministry::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'leader' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'featured_image' => '/storage/uploads/ministries/sample.jpg',
            'category_id' => MinistryCategory::factory(),
            'meeting_day' => 'Sunday',
            'meeting_time' => '10:00 AM',
            'location' => fake()->address(),
            'featured' => false,
            'status' => 'published',
            'published_at' => now(),
            'display_order' => 1,
        ];
    }
}
