<?php

namespace App\Providers;

use App\Models\AuditLog;
use App\Models\ChurchSetting;
use App\Models\Media;
use App\Models\Role;
use App\Models\Sermon;
use App\Models\Song;
use App\Models\SongCategory;
use App\Models\Speaker;
use App\Models\User;
use App\Policies\AuditLogPolicy;
use App\Policies\MediaPolicy;
use App\Policies\RolePolicy;
use App\Policies\SettingPolicy;
use App\Policies\SermonPolicy;
use App\Policies\SongCategoryPolicy;
use App\Policies\SongPolicy;
use App\Policies\SpeakerPolicy;
use App\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model policies
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(ChurchSetting::class, SettingPolicy::class);
        Gate::policy(AuditLog::class, AuditLogPolicy::class);
        Gate::policy(Media::class, MediaPolicy::class);
        Gate::policy(Song::class, SongPolicy::class);
        Gate::policy(SongCategory::class, SongCategoryPolicy::class);
        Gate::policy(Sermon::class, SermonPolicy::class);
        Gate::policy(Speaker::class, SpeakerPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);

        // Named rate limiter required by the 'throttle:api' middleware
        // applied to all authenticated routes in routes/api.php.
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
