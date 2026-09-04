<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Feature\Traits\CreatesAdminUser;
use Tests\TestCase;

class ImageUploadTest extends TestCase
{
    use RefreshDatabase, CreatesAdminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
        Storage::fake('public');
    }

    public function test_authenticated_admin_can_upload_image(): void
    {
        $headers = $this->superAdminHeaders();
        $file = UploadedFile::fake()->image('test-banner.jpg', 800, 600);

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/upload/image', [
            'image'  => $file,
            'folder' => 'blogs',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => ['url', 'path', 'name', 'size', 'mime_type'],
                 ]);

        $path = $response->json('data.path');
        $this->assertStringStartsWith('/storage/', $response->json('data.url'));
        Storage::disk('public')->assertExists($path);
    }

    public function test_upload_rejects_non_image_files(): void
    {
        $headers = $this->superAdminHeaders();
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->withHeaders($headers)->postJson('/api/v1/admin/upload/image', [
            'image' => $file,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['image']);
    }

    public function test_unauthenticated_user_cannot_upload_image(): void
    {
        $file = UploadedFile::fake()->image('test.jpg');

        $this->postJson('/api/v1/admin/upload/image', [
            'image' => $file,
        ])->assertStatus(401);
    }
}
