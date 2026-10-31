<?php

namespace Tests\Feature;

use App\Models\Song;
use App\Models\SongCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class SongApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_public_can_list_published_songs(): void
    {
        Song::factory()->count(3)->create(['status' => 'published']);
        Song::factory()->create(['status' => 'draft']);

        $response = $this->getJson('/api/v1/songs');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_can_view_song_by_id(): void
    {
        $song = Song::factory()->create(['status' => 'published']);

        $response = $this->getJson("/api/v1/songs/{$song->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $song->id);
    }

    public function test_admin_can_create_song(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/songs', [
            'title'  => 'Amazing Grace',
            'artist' => 'John Newton',
            'lyrics' => 'Amazing grace how sweet the sound that saved a wretch like me.',
            'status' => 'draft',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Amazing Grace');

        $this->assertDatabaseHas('songs', ['title' => 'Amazing Grace']);
    }

    public function test_admin_can_update_song(): void
    {
        $song    = Song::factory()->create(['title' => 'Old Title']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/songs/{$song->id}", [
            'title'  => 'New Title',
            'status' => 'draft',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.title', 'New Title');
    }

    public function test_admin_can_delete_song(): void
    {
        $song    = Song::factory()->create();
        $headers = $this->superAdminHeaders();

        $this->withHeaders($headers)->deleteJson("/api/v1/admin/songs/{$song->id}")
             ->assertStatus(200);

        $this->assertSoftDeleted('songs', ['id' => $song->id]);
    }

    public function test_public_can_list_song_categories(): void
    {
        SongCategory::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/song-categories');

        $response->assertStatus(200)
                 ->assertJsonPath('message', 'Song categories retrieved');
        $this->assertCount(2, $response->json('data'));
    }

    public function test_admin_can_create_song_category(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/song-categories', [
            'name'          => 'Praise & Worship',
            'description'   => 'Songs for praise and worship',
            'display_order' => 1,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Praise & Worship');

        $this->assertDatabaseHas('song_categories', ['name' => 'Praise & Worship']);
    }

    public function test_admin_can_update_song_category(): void
    {
        $category = SongCategory::factory()->create(['name' => 'Old Category']);
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/song-categories/{$category->id}", [
            'name'   => 'Updated Category',
            'status' => 'active',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'Updated Category');

        $this->assertDatabaseHas('song_categories', ['id' => $category->id, 'name' => 'Updated Category']);
    }

    public function test_admin_can_delete_song_category(): void
    {
        $category = SongCategory::factory()->create();
        $headers  = $this->superAdminHeaders();

        $this->withHeaders($headers)->deleteJson("/api/v1/admin/song-categories/{$category->id}")
             ->assertStatus(200);

        $this->assertSoftDeleted('song_categories', ['id' => $category->id]);
    }

    public function test_admin_can_create_song_category_when_slug_column_exists(): void
    {
        \Illuminate\Support\Facades\Schema::table('song_categories', function ($table) {
            $table->string('slug')->default('');
        });

        // Reset cached reflection value so hasSlugColumn queries schema
        $ref = new \ReflectionProperty(SongCategory::class, 'hasSlugColumn');
        $ref->setValue(null, null);

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/song-categories', [
            'name'          => 'Special Choir',
            'description'   => 'Choir songs',
            'display_order' => 3,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Special Choir');

        $this->assertDatabaseHas('song_categories', [
            'name' => 'Special Choir',
            'slug' => 'special-choir',
        ]);
    }
}
