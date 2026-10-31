<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_public_can_list_published_events(): void
    {
        Event::factory()->count(3)->create(['status' => 'published', 'published_at' => now(), 'start_date' => now()->addDays(3)]);
        Event::factory()->create(['status' => 'draft']);

        $response = $this->getJson('/api/v1/events');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_public_can_view_event_by_id(): void
    {
        $event = Event::factory()->create(['status' => 'published', 'published_at' => now(), 'start_date' => now()->addDays(5)]);

        $response = $this->getJson("/api/v1/events/{$event->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $event->id);
    }

    public function test_public_get_404_for_nonexistent_event(): void
    {
        $this->getJson('/api/v1/events/99999')->assertStatus(404);
    }

    public function test_admin_can_create_event(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/events', [
            'title'       => 'Church Picnic',
            'description' => 'A wonderful church picnic.',
            'status'      => 'draft',
            'start_date'  => now()->addWeek()->toDateString(),
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Church Picnic');

        $this->assertDatabaseHas('events', ['title' => 'Church Picnic']);
    }

    public function test_admin_can_update_event(): void
    {
        $event   = Event::factory()->create(['title' => 'Old Title', 'start_date' => now()->addDays(2)]);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->putJson("/api/v1/admin/events/{$event->id}", [
            'title'      => 'New Title',
            'status'     => 'draft',
            'start_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.title', 'New Title');
    }

    public function test_admin_can_delete_event(): void
    {
        $event   = Event::factory()->create();
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->deleteJson("/api/v1/admin/events/{$event->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('events', ['id' => $event->id]);
    }

    public function test_event_creation_requires_title_and_start_date(): void
    {
        $headers  = $this->superAdminHeaders();
        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/events', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'start_date']);
    }

    public function test_admin_can_view_draft_event_via_admin_show(): void
    {
        $event   = Event::factory()->create(['status' => 'draft']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->getJson("/api/v1/admin/events/{$event->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $event->id)
                 ->assertJsonPath('data.status', 'draft');
    }

    public function test_admin_can_cancel_event(): void
    {
        $event   = Event::factory()->create(['status' => 'published']);
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)
                         ->patchJson("/api/v1/admin/events/{$event->id}/cancel");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $event->id)
                 ->assertJsonPath('data.status', 'cancelled');

        $this->assertDatabaseHas('events', [
            'id'     => $event->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_unauthenticated_cannot_create_event(): void
    {
        $this->postJson('/api/v1/admin/events', ['title' => 'Test'])
             ->assertStatus(401);
    }

    public function test_admin_can_create_event_category(): void
    {
        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/event-categories', [
            'name'          => 'Conferences',
            'description'   => 'Church conferences',
            'display_order' => 1,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Conferences');

        $this->assertDatabaseHas('event_categories', ['name' => 'Conferences']);
    }

    public function test_admin_can_create_event_category_when_slug_column_exists(): void
    {
        \Illuminate\Support\Facades\Schema::table('event_categories', function ($table) {
            $table->string('slug')->default('');
        });
        EventCategory::$hasSlugColumnCache = [];

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/event-categories', [
            'name'          => 'Outreach Events',
            'description'   => 'Community outreach',
            'display_order' => 2,
            'status'        => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Outreach Events');

        $this->assertDatabaseHas('event_categories', [
            'name' => 'Outreach Events',
            'slug' => 'outreach-events',
        ]);
    }

    public function test_admin_can_filter_event_registrations(): void
    {
        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'Sarah Attendee',
            'email'   => 'sarah@example.com',
            'phone'   => '0987654321',
            'subject' => 'Event Registration: Annual Youth Conference 2026',
            'message' => "New registration for Annual Youth Conference 2026.\nAttendees Count: 2\nNotes: Looking forward to it!",
            'status'  => 'unread',
        ]);

        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'John Ministry',
            'email'   => 'john@example.com',
            'subject' => 'Join Ministry: Worship Team',
            'message' => 'I would like to join the worship ministry.',
            'status'  => 'unread',
        ]);

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/contact-messages?type=event');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Event Registration: Annual Youth Conference 2026', $response->json('data.0.subject'));
        $this->assertSame('Sarah Attendee', $response->json('data.0.name'));
    }

    public function test_admin_can_retrieve_event_registration_stats(): void
    {
        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'Mark Registrant',
            'email'   => 'mark@example.com',
            'subject' => 'Event Registration: Easter Service',
            'message' => "Attendees Count: 4",
            'status'  => 'unread',
        ]);

        \App\Models\ContactMessage::create([
            'uuid'    => (string) \Illuminate\Support\Str::uuid(),
            'name'    => 'Chloe Registrant',
            'email'   => 'chloe@example.com',
            'subject' => 'Event Registration: Easter Service',
            'message' => "Attendees Count: 1",
            'status'  => 'replied',
        ]);

        $headers = $this->superAdminHeaders();

        $response = $this->withHeaders($headers)->getJson('/api/v1/admin/contact-messages/stats?type=event');

        $response->assertStatus(200)
                 ->assertJsonPath('data.total', 2)
                 ->assertJsonPath('data.unread', 1)
                 ->assertJsonPath('data.replied', 1);
    }
}
