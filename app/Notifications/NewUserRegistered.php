<?php

namespace App\Notifications;

use App\Channels\CustomDatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $userName,
        public string $userEmail
    ) {}

    public function via($notifiable): array
    {
        return ['mail', CustomDatabaseChannel::class];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New User Registration')
            ->greeting('Hello ' . $notifiable->display_name . ',')
            ->line('A new user has registered on the church website.')
            ->line('**Name:** ' . $this->userName)
            ->line('**Email:** ' . $this->userEmail)
            ->action('View User Profile', url('/admin/users'))
            ->line('Please review the new user and assign appropriate permissions.')
            ->salutation('Regards, Horaios Baptist Church');
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => 'New User Registration',
            'message' => "A new user '{$this->userName}' ({$this->userEmail}) has registered on the website.",
            'link' => '/admin/users',
            'type' => 'user_registration',
            'data' => [
                'user_name' => $this->userName,
                'user_email' => $this->userEmail,
            ],
            'is_read' => false,
        ];
    }
}
