<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const MAX_FAILED_ATTEMPTS = 5;
    private const LOCKOUT_MINUTES = 15;

    public function login(string $email, string $password, ?string $ip = null, ?string $userAgent = null): array
    {
        $user = User::where('email', $email)->first();

        if ($user && $user->locked_until && $user->locked_until->isFuture()) {
            throw ValidationException::withMessages([
                'email' => ["Too many failed login attempts. Please try again after {$user->locked_until->diffForHumans()}."],
            ]);
        }

        if (!$user || !Hash::check($password, $user->password)) {
            if ($user) {
                $this->registerFailedLogin($user);
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated or locked. Please contact administrator.'],
            ]);
        }

        // Successful login clears any prior lockout state
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditLogService::log('login', 'User', (string) $user->id, null, ['ip' => $ip]);

        return [
            'user' => $user->load('role.permissions'),
            'token' => $token,
        ];
    }

    private function registerFailedLogin(User $user): void
    {
        $attempts = $user->failed_login_attempts + 1;

        $update = ['failed_login_attempts' => $attempts];

        if ($attempts >= self::MAX_FAILED_ATTEMPTS) {
            $update['locked_until'] = now()->addMinutes(self::LOCKOUT_MINUTES);
            $update['failed_login_attempts'] = 0;
            AuditLogService::log('account_locked', 'User', (string) $user->id, null, ['locked_until' => $update['locked_until']]);
        }

        $user->update($update);
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

    public function sendPasswordResetLink(string $email): void
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Return success anyway to prevent email enumeration
            return;
        }

        $status = Password::sendResetLink($email);

        if ($status === Password::RESET_LINK_SENT) {
            AuditLogService::log('password_reset_requested', 'User', (string) $user->id);
        }
    }

    public function resetPassword(string $token, string $email, string $password): void
    {
        $status = Password::reset($token, function ($user, $newPassword) {
            $user->forceFill([
                'password' => Hash::make($newPassword),
            ])->save();

            AuditLogService::log('password_reset', 'User', (string) $user->id);
        });

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset token.'],
            ]);
        }
    }
}
