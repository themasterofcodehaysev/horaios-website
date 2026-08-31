<?php

namespace App\Notifications;

use App\Channels\CustomDatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $resetToken
    ) {}

    public function via($notifiable): array
    {
        return ['mail', CustomDatabaseChannel::class];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => 'Welcome to Horaios Baptist Church',
            'message' => 'Your account has been created successfully. Please set your password to get started.',
            'link' => '/reset-password/' . $this->resetToken . '?email=' . $notifiable->getEmailForPasswordReset(),
            'type' => 'welcome',
            'data' => [
                'email' => $notifiable->email,
                'reset_token' => $this->resetToken,
            ],
            'is_read' => false,
        ];
    }

    protected function setupUrl($notifiable): string
    {
        return url('/reset-password/' . $this->resetToken) . '?email=' . $notifiable->getEmailForPasswordReset();
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Horaios Baptist Church')
            ->greeting('Dear ' . $notifiable->display_name . ',')
            ->line('Welcome to the Horaios Baptist Church management system!')
            ->line('Your account has been created successfully.')
            ->line('**Email:** ' . $notifiable->email)
            ->action('Set Your Password', $this->setupUrl($notifiable))
            ->line('This link will expire in 60 minutes. Once your password is set, you can sign in at the link above.')
            ->line('If you have any questions, please contact the church administration.')
            ->salutation('Welcome to the family, Horaios Baptist Church');
    }
}
