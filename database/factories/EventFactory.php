<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'featured_image' => '/storage/uploads/events/sample.jpg',
            'category_id' => EventCategory::factory(),
            'location' => fake()->address(),
            'google_map_url' => 'https://maps.google.com/?q=sample',
            'start_date' => now()->addDays(5)->toDateString(),
            'end_date' => now()->addDays(5)->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'registration_required' => false,
            'featured' => false,
            'status' => 'published',
            'published_at' => now(),
        ];
    }
}
