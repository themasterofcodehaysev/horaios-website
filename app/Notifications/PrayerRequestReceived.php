<?php

namespace App\Notifications;

use App\Channels\CustomDatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrayerRequestReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $prayerTitle,
        public string $requesterName,
        public string $urgency
    ) {}

    public function via($notifiable): array
    {
        return ['mail', CustomDatabaseChannel::class];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => 'New Prayer Request Received',
            'message' => "A new prayer request '{$this->prayerTitle}' has been submitted by {$this->requesterName}.",
            'link' => '/admin/prayer-requests',
            'type' => 'prayer_request',
            'data' => [
                'prayer_title' => $this->prayerTitle,
                'requester_name' => $this->requesterName,
                'urgency' => $this->urgency,
            ],
            'is_read' => false,
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Prayer Request Received')
            ->greeting('Hello ' . $notifiable->display_name . ',')
            ->line('A new prayer request has been submitted on the church website.')
            ->line('**Prayer Title:** ' . $this->prayerTitle)
            ->line('**From:** ' . $this->requesterName)
            ->line('**Urgency:** ' . ucfirst($this->urgency))
            ->action('View Prayer Requests', url('/admin/prayer-requests'))
            ->line('Please review and respond to this prayer request in a timely manner.')
            ->salutation('Regards, Horaios Baptist Church');
    }
}
