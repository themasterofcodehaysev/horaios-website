<?php

namespace Database\Factories;

use App\Models\Speaker;
use Illuminate\Database\Eloquent\Factories\Factory;

class SpeakerFactory extends Factory
{
    protected $model = Speaker::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'photo' => '/storage/uploads/speakers/sample.jpg',
            'biography' => fake()->paragraph(),
            'position' => 'Senior Pastor',
            'email' => fake()->safeEmail(),
            'status' => 'active',
            'display_order' => 1,
        ];
    }
}
