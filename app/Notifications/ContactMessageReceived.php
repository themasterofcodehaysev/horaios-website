<?php

namespace App\Notifications;

use App\Channels\CustomDatabaseChannel;
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
        return ['mail', CustomDatabaseChannel::class];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => 'New Contact Message Received',
            'message' => "A new contact message '{$this->subject}' has been received from {$this->senderName}.",
            'link' => '/admin/contact-messages',
            'type' => 'contact_message',
            'data' => [
                'subject' => $this->subject,
                'sender_name' => $this->senderName,
                'sender_email' => $this->senderEmail,
            ],
            'is_read' => false,
        ];
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
