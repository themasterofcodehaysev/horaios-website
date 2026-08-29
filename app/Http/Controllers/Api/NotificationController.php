<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class NotificationController extends BaseApiController
{
    public function __construct(protected NotificationService $notificationService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->getPaginatedNotifications(
            $request->user(),
            $request->input('per_page', 20)
        );

        return $this->paginated(NotificationResource::collection($notifications), 'Notifications retrieved');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->notificationService->getUnreadCount($request->user());

        return $this->success(['count' => $count, 'unread_count' => $count], 'Unread count retrieved');
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        try {
            $this->notificationService->markAsRead($notification);
            return $this->success(new NotificationResource($notification), 'Notification marked as read');
        } catch (Throwable $e) {
            return $this->error('Failed to mark notification as read: ' . $e->getMessage(), 500);
        }
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $count = $this->notificationService->markAllAsRead($request->user());
            return $this->success(['marked_count' => $count], 'All notifications marked as read');
        } catch (Throwable $e) {
            return $this->error('Failed to mark all notifications as read: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        try {
            $this->notificationService->delete($notification);
            return $this->noContent('Notification deleted');
        } catch (Throwable $e) {
            return $this->error('Failed to delete notification: ' . $e->getMessage(), 500);
        }
    }
}
