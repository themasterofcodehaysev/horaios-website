<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends BaseApiController
{
    public function __construct(protected AuthService $authService)
    {
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return Sanctum token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->validated('email'),
                $request->validated('password'),
                $request->ip(),
                $request->userAgent()
            );

            return $this->success([
                'token' => $result['token'],
                'token_type' => 'Bearer',
                'user' => new UserResource($result['user']->load('role')),
            ], 'Login successful');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error('Invalid credentials', 401);
        } catch (Throwable $e) {
            return $this->error('Login failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/auth/logout
     * Revoke the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user());

            return $this->noContent('Logged out successfully');
        } catch (Throwable $e) {
            return $this->error('Logout failed', 500);
        }
    }

    /**
     * GET /api/auth/me
     * Return the authenticated user's profile.
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('role.permissions');

            return $this->success(new UserResource($user), 'User profile retrieved');
        } catch (Throwable $e) {
            return $this->error('Failed to retrieve profile', 500);
        }
    }

    /**
     * POST /api/auth/change-password
     * Change password for the authenticated user.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->changePassword(
                $request->user(),
                $request->validated('current_password'),
                $request->validated('new_password')
            );

            return $this->success(null, 'Password changed successfully');
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (Throwable $e) {
            return $this->error('Failed to change password', 500);
        }
    }

    /**
     * POST /api/auth/logout-all
     * Revoke ALL tokens for the authenticated user.
     */
    public function logoutAll(Request $request): JsonResponse
    {
        try {
            $request->user()->tokens()->delete();

            return $this->noContent('Logged out from all devices');
        } catch (Throwable $e) {
            return $this->error('Logout failed', 500);
        }
    }

    /**
     * POST /api/auth/forgot-password
     * Send a password reset link to the given email, if it exists.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->sendPasswordResetLink($request->validated('email'));

        // Always return success to avoid leaking which emails are registered.
        return $this->success(null, 'If that email address is registered, a password reset link has been sent.');
    }

    /**
     * POST /api/auth/reset-password
     * Reset a user's password using a valid reset token.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->resetPassword(
                $request->validated('token'),
                $request->validated('email'),
                $request->validated('password')
            );

            return $this->success(null, 'Password reset successfully. You can now sign in.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error($e->getMessage(), 422, $e->errors());
        }
    }
}
