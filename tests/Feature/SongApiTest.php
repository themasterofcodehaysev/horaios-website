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
}
