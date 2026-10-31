<?php

namespace Tests\Feature;

use App\Models\Sermon;
use App\Models\SermonCategory;
use App\Models\SermonSeries;
use App\Models\Speaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class SermonApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_public_can_list_published_sermons(): void
    {
        Sermon::factory()->count(3)->create(['status' => 'published', 'published_at' => now()]);
        Sermon::factory()->create(['status' => 'draft']);

        $response = $this->getJson('/api/v1/sermons');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_can_view_sermon_by_id(): void
    {
        $sermon = Sermon::factory()->create(['status' => 'published', 'published_at' => now()]);

        $response = $this->getJson("/api/v1/sermons/{$sermon->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $sermon->id);
    }

    public function test_public_cannot_view_draft_sermon(): void
    {
        $sermon = Sermon::factory()->create(['status' => 'draft']);

        $this->getJson("/api/v1/sermons/{$sermon->id}")->assertStatus(403);
    }

    public function test_admin_can_create_sermon(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/sermons', [
            'title'  => 'Faith Over Fear',
            'status' => 'draft',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Faith Over Fear');

        $this->assertDatabaseHas('sermons', ['title' => 'Faith Over Fear']);
    }

    public function test_admin_can_update_sermon(): void
    {
        $sermon  = Sermon::factory()->create(['title' => 'Initial Title']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/sermons/{$sermon->id}", [
            'title'  => 'Updated Title',
            'status' => 'published',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.title', 'Updated Title');
    }

    public function test_admin_can_delete_sermon(): void
    {
        $sermon  = Sermon::factory()->create();
        $headers = $this->superAdminHeaders();

        $this->withHeaders($headers)->deleteJson("/api/v1/admin/sermons/{$sermon->id}")
             ->assertStatus(200);

        $this->assertSoftDeleted('sermons', ['id' => $sermon->id]);
    }

    public function test_admin_can_view_draft_sermon_via_admin_show(): void
    {
        $sermon  = Sermon::factory()->create(['status' => 'draft']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->getJson("/api/v1/admin/sermons/{$sermon->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $sermon->id)
                 ->assertJsonPath('data.status', 'draft');
    }

    public function test_sermon_normalizes_legacy_localhost_thumbnail(): void
    {
        $sermon = Sermon::factory()->create([
            'status'    => 'published',
            'thumbnail' => 'http://localhost/storage/uploads/sermons/test.jpg',
        ]);

        $response = $this->getJson("/api/v1/sermons/{$sermon->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('data.thumbnail', '/storage/uploads/sermons/test.jpg');
    }

    public function test_admin_can_create_sermon_category(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/sermon-categories', [
            'name'          => 'Sunday Worship',
            'description'   => 'Main Sunday service sermons',
            'display_order' => 1,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Sunday Worship');

        $this->assertDatabaseHas('sermon_categories', ['name' => 'Sunday Worship']);
    }

    public function test_admin_can_update_sermon_category(): void
    {
        $category = SermonCategory::factory()->create(['name' => 'Old Category']);
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/sermon-categories/{$category->id}", [
            'name'   => 'Updated Category',
            'status' => 'active',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'Updated Category');

        $this->assertDatabaseHas('sermon_categories', ['id' => $category->id, 'name' => 'Updated Category']);
    }

    public function test_admin_can_create_sermon_category_when_slug_column_exists(): void
    {
        \Illuminate\Support\Facades\Schema::table('sermon_categories', function ($table) {
            $table->string('slug')->default('');
        });
        SermonCategory::$hasSlugColumnCache = [];

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/sermon-categories', [
            'name'          => 'Bible Study Series',
            'description'   => 'Mid-week study',
            'display_order' => 2,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Bible Study Series');

        $this->assertDatabaseHas('sermon_categories', [
            'name' => 'Bible Study Series',
            'slug' => 'bible-study-series',
        ]);
    }
}
