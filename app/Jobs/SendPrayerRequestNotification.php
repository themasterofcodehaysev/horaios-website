<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\PrayerRequestReceived;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendPrayerRequestNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $prayerTitle,
        public string $requesterName,
        public string $urgency
    ) {}

    public function handle(): void
    {
        $adminUsers = User::whereHas('role', function ($query) {
            $query->where('name', 'admin')->orWhere('name', 'super_admin');
        })->get();

        foreach ($adminUsers as $admin) {
            $admin->notify(new PrayerRequestReceived(
                $this->prayerTitle,
                $this->requesterName,
                $this->urgency
            ));
        }
    }
}
