<?php

namespace Tests\Feature;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    // -------------------------------------------------------------------------
    // Public endpoints
    // -------------------------------------------------------------------------

    public function test_public_can_list_published_blog_posts(): void
    {
        BlogPost::factory()->count(3)->create(['status' => 'published', 'published_at' => now()]);
        BlogPost::factory()->create(['status' => 'draft']);

        $response = $this->getJson('/api/v1/blogs');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'meta']);

        // Only published posts should be visible publicly
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_can_view_published_post_by_id(): void
    {
        $post = BlogPost::factory()->create(['status' => 'published', 'published_at' => now()]);

        $response = $this->getJson("/api/v1/blogs/{$post->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $post->id);
    }

    public function test_public_cannot_view_draft_post(): void
    {
        $post = BlogPost::factory()->create(['status' => 'draft']);

        $response = $this->getJson("/api/v1/blogs/{$post->id}");

        $response->assertStatus(403);
    }

    public function test_public_get_404_for_nonexistent_post(): void
    {
        $response = $this->getJson('/api/v1/blogs/99999');

        $response->assertStatus(404);
    }

    public function test_public_can_get_related_posts(): void
    {
        $category = BlogCategory::factory()->create();
        $post     = BlogPost::factory()->create(['status' => 'published', 'published_at' => now(), 'category_id' => $category->id]);
        BlogPost::factory()->count(2)->create(['status' => 'published', 'published_at' => now(), 'category_id' => $category->id]);

        $response = $this->getJson("/api/v1/blogs/{$post->id}/related");

        $response->assertStatus(200);
    }

    // -------------------------------------------------------------------------
    // Admin endpoints
    // -------------------------------------------------------------------------

    public function test_admin_can_list_all_blog_posts(): void
    {
        BlogPost::factory()->count(5)->create(['status' => 'draft']);

        $headers  = $this->superAdminHeaders();
        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/blogs');

        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(5, count($response->json('data')));
    }

    public function test_admin_can_create_blog_post(): void
    {
        $category = BlogCategory::factory()->create();
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/blogs', [
            'title'       => 'Test Blog Post',
            'content'     => 'Some content here.',
            'status'      => 'draft',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Test Blog Post');

        $this->assertDatabaseHas('blog_posts', ['title' => 'Test Blog Post']);
    }

    public function test_admin_can_update_blog_post(): void
    {
        $post    = BlogPost::factory()->create(['status' => 'draft']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/blogs/{$post->id}", [
            'title'   => 'Updated Title',
            'content' => 'Updated content.',
            'status'  => 'draft',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.title', 'Updated Title');
    }

    public function test_admin_can_delete_blog_post(): void
    {
        $post    = BlogPost::factory()->create();
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->deleteJson("/api/v1/admin/blogs/{$post->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('blog_posts', ['id' => $post->id]);
    }

    public function test_admin_can_toggle_publish_status(): void
    {
        $post    = BlogPost::factory()->create(['status' => 'draft']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->patchJson("/api/v1/admin/blogs/{$post->id}/toggle-publish");

        $response->assertStatus(200);
        $this->assertDatabaseHas('blog_posts', ['id' => $post->id, 'status' => 'published']);
    }

    public function test_admin_can_toggle_featured_status(): void
    {
        $post    = BlogPost::factory()->create(['featured' => false]);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->patchJson("/api/v1/admin/blogs/{$post->id}/toggle-featured");

        $response->assertStatus(200);
        $this->assertDatabaseHas('blog_posts', ['id' => $post->id, 'featured' => true]);
    }

    public function test_admin_can_duplicate_blog_post(): void
    {
        $post    = BlogPost::factory()->create(['title' => 'Original Post']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->postJson("/api/v1/admin/blogs/{$post->id}/duplicate");

        $response->assertStatus(201);
        $this->assertDatabaseCount('blog_posts', 2);
    }

    public function test_admin_can_view_draft_blog_post_via_admin_show(): void
    {
        $post    = BlogPost::factory()->create(['status' => 'draft']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->getJson("/api/v1/admin/blogs/{$post->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $post->id)
                 ->assertJsonPath('data.status', 'draft');
    }

    public function test_unauthenticated_cannot_create_blog_post(): void
    {
        $response = $this->postJson('/api/v1/admin/blogs', [
            'title'   => 'Test',
            'content' => 'Content',
            'status'  => 'draft',
        ]);

        $response->assertStatus(401);
    }

    public function test_blog_post_creation_requires_title(): void
    {
        $headers  = $this->superAdminHeaders();
        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/blogs', [
            'content' => 'No title here.',
            'status'  => 'draft',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title']);
    }
}
