<?php

namespace App\Console\Commands;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateSuperAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:super-admin 
                            {--email=admin@horaiosbaptist.org : Email address for the Super Admin}
                            {--password=$Admin@Horaios : Password for the Super Admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create or update the Super Admin user account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = (string) $this->option('email');
        $password = (string) $this->option('password');

        $this->info("Setting up Super Admin for: {$email}...");

        // Ensure super_admin role exists
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            [
                'display_name' => 'Super Administrator',
                'description' => 'Full system access and configuration.',
                'is_system' => true,
            ]
        );

        // Sync all permissions to the super_admin role
        $allPermissions = Permission::all();
        if ($allPermissions->isNotEmpty()) {
            $superAdminRole->permissions()->sync($allPermissions->pluck('id'));
        }

        // Create or update Super Admin user
        $user = User::withTrashed()->where('email', $email)->first();

        if ($user) {
            if ($user->trashed()) {
                $user->restore();
            }

            $user->update([
                'password' => Hash::make($password),
                'role_id' => $superAdminRole->id,
                'status' => 'active',
                'email_verified_at' => $user->email_verified_at ?? now(),
                'locked_until' => null,
                'failed_login_attempts' => 0,
            ]);

            $this->info("✓ Super Admin user [{$email}] was updated with new password and full permissions.");
        } else {
            $user = User::create([
                'uuid' => (string) Str::uuid(),
                'first_name' => 'Horaios',
                'last_name' => 'Admin',
                'display_name' => 'Horaios Super Admin',
                'email' => $email,
                'phone' => '+85523000000',
                'password' => Hash::make($password),
                'role_id' => $superAdminRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            $this->info("✓ Super Admin user [{$email}] created successfully with full permissions.");
        }

        $this->newLine();
        $this->table(
            ['Field', 'Value'],
            [
                ['Email', $email],
                ['Password', $password],
                ['Role', $superAdminRole->display_name ?? 'Super Administrator'],
                ['Status', 'Active'],
            ]
        );

        return Command::SUCCESS;
    }
}
