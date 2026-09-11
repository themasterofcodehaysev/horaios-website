<?php

namespace Database\Factories;

use App\Models\PrayerRequest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PrayerRequestFactory extends Factory
{
    protected $model = PrayerRequest::class;

    public function definition(): array
    {
        return [
            'uuid' => (string) Str::uuid(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'title' => fake()->sentence(),
            'request' => fake()->paragraph(),
            'request_type' => fake()->randomElement(['general', 'healing', 'guidance', 'thanksgiving', 'emergency']),
            'urgency' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'allow_public_prayer' => false,
            'is_anonymous' => false,
            'status' => 'pending',
            'admin_notes' => null,
            'processed_by' => null,
            'processed_at' => null,
        ];
    }
}
