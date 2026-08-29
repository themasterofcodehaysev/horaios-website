<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $subject,
        public string $senderName,
        public string $senderEmail
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Contact Message Received')
            ->greeting('Hello ' . $notifiable->display_name . ',')
            ->line('A new contact message has been submitted on the church website.')
            ->line('**Subject:** ' . $this->subject)
            ->line('**From:** ' . $this->senderName . ' (' . $this->senderEmail . ')')
            ->action('View Contact Messages', url('/admin/contact-messages'))
            ->line('Please review and respond to this message in a timely manner.')
            ->salutation('Regards, Horaios Baptist Church');
    }
}
