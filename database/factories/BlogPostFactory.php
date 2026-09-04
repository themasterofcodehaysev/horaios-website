<?php

namespace Database\Factories;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'featured_image' => '/storage/uploads/blogs/sample.jpg',
            'category_id' => BlogCategory::factory(),
            'featured' => false,
            'status' => 'published',
            'published_at' => now(),
        ];
    }
}
