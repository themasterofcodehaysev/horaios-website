<?php

namespace App\Channels;

use App\Models\Notification as CustomNotification;
use Illuminate\Notifications\Notification;

class CustomDatabaseChannel
{
    /**
     * Send the given notification to the custom notifications table.
     */
    public function send($notifiable, Notification $notification): void
    {
        $data = $notification->toDatabase($notifiable);

        CustomNotification::create([
            'user_id' => $notifiable->id,
            'type' => $data['type'] ?? 'notification',
            'title' => $data['title'] ?? 'Notification',
            'message' => $data['message'] ?? '',
            'data' => $data['data'] ?? [],
            'link' => $data['link'] ?? null,
            'is_read' => $data['is_read'] ?? false,
        ]);
    }
}
