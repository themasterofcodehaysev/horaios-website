<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\ChurchService;
use App\Models\Event;
use App\Models\Ministry;
use App\Models\Role;
use App\Models\Sermon;
use App\Models\Song;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchApiTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        $role = Role::firstOrCreate(
            ['name' => Role::ADMIN],
            ['display_name' => 'Admin', 'description' => 'Administrator']
        );

        $user = User::factory()->create([
            'role_id' => $role->id,
            'status'  => 'active',
        ]);

        return $user;
    }

    private function authHeaders(User $user): array
    {
        $token = $user->createToken('test-token')->plainTextToken;

        return [
            'Authorization' => "Bearer {$token}",
            'Accept'        => 'application/json',
        ];
    }

    public function test_unauthenticated_cannot_search(): void
    {
        $response = $this->getJson('/api/v1/admin/search?query=test');
        $response->assertStatus(401);
    }

    public function test_search_requires_minimum_two_characters(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->authHeaders($admin);

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/search?query=a');
        $response->assertStatus(400);
    }

    public function test_admin_can_perform_global_search(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->authHeaders($admin);

        Song::factory()->create(['title' => 'Amazing Grace']);
        Sermon::factory()->create(['title' => 'Walking in Grace']);
        BlogPost::factory()->create(['title' => 'Grace Overflowing']);
        Event::factory()->create(['title' => 'Grace Conference']);
        Ministry::factory()->create(['name' => 'Grace Fellowship']);
        ChurchService::create([
            'title'       => 'Grace Sunday Gathering',
            'day'         => 'Sunday',
            'time'        => '09:00 AM - 10:30 AM',
            'status'      => 'active',
        ]);

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/search?query=Grace');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertNotEmpty($data['songs']);
        $this->assertNotEmpty($data['sermons']);
        $this->assertNotEmpty($data['blogs']);
        $this->assertNotEmpty($data['events']);
        $this->assertNotEmpty($data['ministries']);
        $this->assertNotEmpty($data['services']);
    }

    public function test_admin_can_search_by_type(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->authHeaders($admin);

        Song::factory()->create(['title' => 'How Great Thou Art']);

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/search/songs?query=Great');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('How Great Thou Art', $data[0]['title']);
    }
}
