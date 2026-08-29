<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Str;

class NotificationService
{
    public function notify(User $user, string $type, string $title, string $message, ?string $link = null, ?array $data = null): Notification
    {
        return Notification::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'data' => $data,
        ]);
    }

    public function notifyMultiple(array $userIds, string $type, string $title, string $message, ?string $link = null, ?array $data = null): void
    {
        foreach ($userIds as $userId) {
            Notification::create([
                'uuid' => (string) Str::uuid(),
                'user_id' => $userId,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'link' => $link,
                'data' => $data,
            ]);
        }
    }

    public function markAsRead(Notification $notification): void
    {
        $notification->markAsRead();
    }

    public function markAllAsRead(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function delete(Notification $notification): void
    {
        $notification->delete();
    }

    public function getUserNotifications(User $user, int $limit = 20)
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getUnreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }

    public function getPaginatedNotifications(User $user, int $perPage = 20)
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    // Predefined notification types
    public function notifyNewPrayerRequest(User $user, string $prayerTitle): Notification
    {
        return $this->notify(
            $user,
            'new_prayer_request',
            'New Prayer Request',
            "A new prayer request has been submitted: {$prayerTitle}",
            '/admin/prayer-requests',
            ['prayer_title' => $prayerTitle]
        );
    }

    public function notifyNewContactMessage(User $user, string $subject): Notification
    {
        return $this->notify(
            $user,
            'new_contact_message',
            'New Contact Message',
            "A new contact message has been received: {$subject}",
            '/admin/contact-messages',
            ['subject' => $subject]
        );
    }

    public function notifyNewUser(User $user, string $userName): Notification
    {
        return $this->notify(
            $user,
            'new_user',
            'New User Registration',
            "A new user has registered: {$userName}",
            '/admin/users',
            ['user_name' => $userName]
        );
    }

    public function notifySystemAlert(User $user, string $message): Notification
    {
        return $this->notify(
            $user,
            'system_alert',
            'System Alert',
            $message,
            null,
            null
        );
    }
}
