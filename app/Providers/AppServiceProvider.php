<?php

namespace App\Providers;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\ChurchSetting;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\FooterSetting;
use App\Models\HomepageSection;
use App\Models\Ministry;
use App\Models\NavigationMenu;
use App\Models\NavigationMenuItem;
use App\Models\PrayerRequest;
use App\Models\Role;
use App\Models\Sermon;
use App\Models\Song;
use App\Models\SongCategory;
use App\Models\Speaker;
use App\Models\User;
use App\Policies\AuditLogPolicy;
use App\Policies\BlogPolicy;
use App\Policies\ContactPolicy;
use App\Policies\EventPolicy;
use App\Policies\FooterSettingPolicy;
use App\Policies\HomepageSectionPolicy;
use App\Policies\MinistryPolicy;
use App\Policies\NavigationMenuItemPolicy;
use App\Policies\NavigationPolicy;
use App\Policies\PrayerPolicy;
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
        Gate::before(function (User $user, string $ability) {
            if ($user->isSuperAdmin()) {
                return true;
            }
            return null;
        });

        // Register model policies
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(ChurchSetting::class, SettingPolicy::class);
        Gate::policy(AuditLog::class, AuditLogPolicy::class);
        Gate::policy(Song::class, SongPolicy::class);
        Gate::policy(SongCategory::class, SongCategoryPolicy::class);
        Gate::policy(Sermon::class, SermonPolicy::class);
        Gate::policy(Speaker::class, SpeakerPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(BlogPost::class, BlogPolicy::class);
        Gate::policy(PrayerRequest::class, PrayerPolicy::class);
        Gate::policy(ContactMessage::class, ContactPolicy::class);
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Ministry::class, MinistryPolicy::class);
        Gate::policy(HomepageSection::class, HomepageSectionPolicy::class);
        Gate::policy(FooterSetting::class, FooterSettingPolicy::class);
        Gate::policy(NavigationMenu::class, NavigationPolicy::class);
        Gate::policy(NavigationMenuItem::class, NavigationMenuItemPolicy::class);

        // Named rate limiter required by the 'throttle:api' middleware
        // applied to all authenticated routes in routes/api.php.
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
