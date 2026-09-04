<?php

namespace Tests\Unit;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogPostModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_post_generates_uuid_on_create(): void
    {
        $post = BlogPost::factory()->create(['title' => 'Test Post']);

        $this->assertNotEmpty($post->uuid);
    }

    public function test_blog_post_sets_published_at_when_published(): void
    {
        $post = BlogPost::factory()->create([
            'status'       => 'published',
            'published_at' => null,
        ]);

        $this->assertNotNull($post->published_at);
    }
}
