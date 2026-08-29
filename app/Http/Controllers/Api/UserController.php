<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class UserController extends BaseApiController
{
    public function __construct(protected UserService $userService)
    {
    }

    /**
     * GET /api/users
     * List all users with pagination and optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $query = User::with('role')
            ->when($request->search, fn($q) => $q->where(function ($inner) use ($request) {
                $inner->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            }))
            ->when($request->role_id, fn($q) => $q->where('role_id', $request->role_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy($request->sort_by ?? 'created_at', $request->sort_dir ?? 'desc');

        $users = $query->paginate($request->per_page ?? 15);

        return $this->paginated(UserResource::collection($users), 'Users retrieved');
    }

    /**
     * POST /api/users
     * Create a new user.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        try {
            $user = $this->userService->createUser($request->validated(), $request->user());

            return $this->created(new UserResource($user->load('role')), 'User created successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to create user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/users/{uuid}
     * Get a specific user by UUID.
     */
    public function show(string $uuid): JsonResponse
    {
        $user = User::with('role.permissions')->where('uuid', $uuid)->firstOrFail();

        $this->authorize('view', $user);

        return $this->success(new UserResource($user), 'User retrieved');
    }

    /**
     * PUT /api/users/{uuid}
     * Update a user.
     */
    public function update(UpdateUserRequest $request, string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        $this->authorize('update', $user);

        try {
            $updated = $this->userService->updateUser($user, $request->validated(), $request->user());

            return $this->success(new UserResource($updated->load('role')), 'User updated successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to update user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/users/{uuid}
     * Soft-delete a user.
     */
    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        $this->authorize('delete', $user);

        try {
            $this->userService->deleteUser($user, $request->user());

            return $this->noContent('User deleted successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to delete user: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/users/{uuid}/restore
     * Restore a soft-deleted user.
     */
    public function restore(Request $request, string $uuid): JsonResponse
    {
        $this->authorize('restore', User::class);

        $user = User::withTrashed()->where('uuid', $uuid)->firstOrFail();
        $user->restore();

        return $this->success(new UserResource($user->load('role')), 'User restored successfully');
    }

    /**
     * PATCH /api/users/{uuid}/toggle-status
     * Toggle a user's status between 'active' and 'inactive'.
     */
    public function toggleStatus(Request $request, string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        $this->authorize('update', $user);

        try {
            $updated = $this->userService->toggleStatus($user, $request->user());

            return $this->success(new UserResource($updated), "User status changed to {$updated->status}");
        } catch (Throwable $e) {
            return $this->error('Failed to update user status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/users/{uuid}/reset-password
     * Trigger a password reset email for the user (admin action).
     */
    public function sendPasswordReset(Request $request, string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        $this->authorize('update', $user);

        try {
            $this->userService->sendPasswordReset($user, $request->user());

            return $this->success(null, 'Password reset link sent successfully');
        } catch (Throwable $e) {
            return $this->error('Failed to send password reset link: ' . $e->getMessage(), 500);
        }
    }
}
