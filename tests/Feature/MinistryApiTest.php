<?php

namespace Tests\Feature;

use App\Models\Ministry;
use App\Models\MinistryCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class MinistryApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_public_can_list_published_ministries(): void
    {
        Ministry::factory()->count(3)->create(['status' => 'published', 'published_at' => now()]);
        Ministry::factory()->create(['status' => 'draft']);

        $response = $this->getJson('/api/v1/ministries');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_can_view_ministry_by_id(): void
    {
        $ministry = Ministry::factory()->create(['status' => 'published', 'published_at' => now()]);

        $response = $this->getJson("/api/v1/ministries/{$ministry->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $ministry->id);
    }

    public function test_admin_can_create_ministry(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/ministries', [
            'name'        => 'Youth Ministry',
            'description' => 'A vibrant ministry for youth and students.',
            'status'      => 'draft',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Youth Ministry');

        $this->assertDatabaseHas('ministries', ['name' => 'Youth Ministry']);
    }

    public function test_admin_can_update_ministry(): void
    {
        $ministry = Ministry::factory()->create(['name' => 'Old Name']);
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/ministries/{$ministry->id}", [
            'name'   => 'New Name',
            'status' => 'draft',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'New Name');
    }

    public function test_admin_can_delete_ministry(): void
    {
        $ministry = Ministry::factory()->create();
        $headers  = $this->superAdminHeaders();

        $this->withHeaders($headers)->deleteJson("/api/v1/admin/ministries/{$ministry->id}")
             ->assertStatus(200);

        $this->assertSoftDeleted('ministries', ['id' => $ministry->id]);
    }

    public function test_admin_can_view_draft_ministry_via_admin_show(): void
    {
        $ministry = Ministry::factory()->create(['status' => 'draft']);
        $headers  = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->getJson("/api/v1/admin/ministries/{$ministry->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $ministry->id)
                 ->assertJsonPath('data.status', 'draft');
    }

    public function test_admin_can_create_ministry_category(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/ministry-categories', [
            'name'          => 'Youth Ministry',
            'description'   => 'Programs for youth',
            'display_order' => 1,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Youth Ministry');

        $this->assertDatabaseHas('ministry_categories', ['name' => 'Youth Ministry']);
    }

    public function test_admin_can_create_ministry_category_when_slug_column_exists(): void
    {
        \Illuminate\Support\Facades\Schema::table('ministry_categories', function ($table) {
            $table->string('slug')->default('');
        });
        MinistryCategory::$hasSlugColumnCache = [];

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/ministry-categories', [
            'name'          => 'Children Fellowship',
            'description'   => 'Children sunday school',
            'display_order' => 2,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Children Fellowship');

        $this->assertDatabaseHas('ministry_categories', [
            'name' => 'Children Fellowship',
            'slug' => 'children-fellowship',
        ]);
    }

    public function test_admin_can_filter_ministry_join_requests(): void
    {
        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'John Doe',
            'email'   => 'john@example.com',
            'phone'   => '012345678',
            'subject' => 'Join Ministry: Outreach Ministry',
            'message' => 'I would love to volunteer and join the outreach ministry.',
            'status'  => 'unread',
        ]);

        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'Jane Smith',
            'email'   => 'jane@example.com',
            'subject' => 'General Inquiry',
            'message' => 'What time does the Sunday morning service begin?',
            'status'  => 'unread',
        ]);

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/contact-messages?type=ministry');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Join Ministry: Outreach Ministry', $response->json('data.0.subject'));
    }

    public function test_admin_can_retrieve_ministry_join_request_stats(): void
    {
        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'Alice Member',
            'email'   => 'alice@example.com',
            'subject' => 'Join Ministry: Worship Team',
            'message' => 'I would like to play guitar in the worship team.',
            'status'  => 'unread',
        ]);

        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'Bob Member',
            'email'   => 'bob@example.com',
            'subject' => 'Join Ministry: Outreach Ministry',
            'message' => 'Ready to help with food distribution programs.',
            'status'  => 'replied',
        ]);

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/contact-messages/stats?type=ministry');

        $response->assertStatus(200)
                 ->assertJsonPath('data.total', 2)
                 ->assertJsonPath('data.unread', 1)
                 ->assertJsonPath('data.replied', 1);
    }
}
