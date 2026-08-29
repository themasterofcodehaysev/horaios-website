<?php

namespace App\Policies;

use App\Models\PrayerRequest;
use App\Models\User;

class PrayerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('prayer_requests.view');
    }

    public function view(User $user, PrayerRequest $prayer): bool
    {
        return $user->can('prayer_requests.view');
    }

    public function create(User $user): bool
    {
        return $user->can('prayer_requests.create');
    }

    public function update(User $user, PrayerRequest $prayer): bool
    {
        return $user->can('prayer_requests.edit');
    }

    public function delete(User $user, PrayerRequest $prayer): bool
    {
        return $user->can('prayer_requests.delete');
    }
}
