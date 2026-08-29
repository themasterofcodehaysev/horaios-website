<?php

namespace App\Notifications;

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
        return ['mail'];
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
