<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(string $email, string $password, ?string $ip = null, ?string $userAgent = null): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated or locked. Please contact administrator.'],
            ]);
        }

        // Update login stats
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLogService::log('login', 'User', (string) $user->id, null, ['ip' => $ip]);

        return [
            'user' => $user->load('role.permissions'),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        AuditLogService::log('logout', 'User', (string) $user->id);
        $user->tokens()->delete();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password does not match.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        AuditLogService::log('password_change', 'User', (string) $user->id);
    }
}
