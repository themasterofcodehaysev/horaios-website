<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ChurchSettingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EventCategoryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\MinistryCategoryController;
use App\Http\Controllers\Api\MinistryController;
use App\Http\Controllers\Api\NavigationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PrayerController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SermonCategoryController;
use App\Http\Controllers\Api\SermonController;
use App\Http\Controllers\Api\SermonSeriesController;
use App\Http\Controllers\Api\SongCategoryController;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\SpeakerController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes are prefixed with /api (configured in bootstrap/app.php)
| Protected routes require auth:sanctum middleware.
|--------------------------------------------------------------------------
*/

// -----------------------------------------------------------------------
// PUBLIC endpoints (no auth required)
// -----------------------------------------------------------------------
Route::middleware('compress')->prefix('v1')->group(function () {

    // Health check endpoint
    Route::get('health', [HealthController::class, 'check'])->name('health.check');

    // Public church settings (only is_public = true settings are returned)
    Route::get('settings/church/public', [ChurchSettingController::class, 'public'])
        ->name('settings.church.public');

    // Public songs endpoints
    Route::prefix('songs')->name('songs.')->group(function () {
        Route::get('/', [SongController::class, 'index'])->name('index');
        Route::get('{identifier}', [SongController::class, 'show'])->name('show');
        Route::get('{identifier}/related', [SongController::class, 'related'])->name('related');
    });

    // Public song categories endpoint
    Route::get('song-categories', [SongCategoryController::class, 'index'])->name('song-categories.index');

    // Public sermon endpoints
    Route::prefix('sermons')->name('sermons.')->group(function () {
        Route::get('/', [SermonController::class, 'index'])->name('index');
        Route::get('{identifier}', [SermonController::class, 'show'])->name('show');
        Route::get('{identifier}/related', [SermonController::class, 'related'])->name('related');
    });

    // Public speakers, series, and categories
    Route::get('speakers', [SpeakerController::class, 'index'])->name('speakers.index');
    Route::get('sermon-series', [SermonSeriesController::class, 'index'])->name('sermon-series.index');
    Route::get('sermon-categories', [SermonCategoryController::class, 'index'])->name('sermon-categories.index');

    // Public blog posts endpoints
    Route::prefix('blogs')->name('blogs.')->group(function () {
        Route::get('/', [BlogController::class, 'index'])->name('index');
        Route::get('{identifier}', [BlogController::class, 'show'])->name('show');
        Route::get('{identifier}/related', [BlogController::class, 'related'])->name('related');
    });

    // Public blog categories endpoint
    Route::get('blog-categories', [BlogCategoryController::class, 'index'])->name('blog-categories.index');

    // Public events endpoints
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('{identifier}', [EventController::class, 'show'])->name('show');
        Route::get('{identifier}/related', [EventController::class, 'related'])->name('related');
    });

    // Public event categories endpoint
    Route::get('event-categories', [EventCategoryController::class, 'index'])->name('event-categories.index');

    // Public ministries endpoints
    Route::prefix('ministries')->name('ministries.')->group(function () {
        Route::get('/', [MinistryController::class, 'index'])->name('index');
        Route::get('{identifier}', [MinistryController::class, 'show'])->name('show');
        Route::get('{identifier}/related', [MinistryController::class, 'related'])->name('related');
    });

    // Public ministry categories endpoint
    Route::get('ministry-categories', [MinistryCategoryController::class, 'index'])->name('ministry-categories.index');

    // Public navigation
    Route::get('navigation', [NavigationController::class, 'publicIndex'])->name('navigation.public');

    // Public homepage
    Route::get('homepage', [HomepageController::class, 'publicIndex'])->name('homepage.public');

    // Public footer
    Route::get('footer', [FooterController::class, 'publicIndex'])->name('footer.public');

    // Public prayer requests endpoints
    Route::prefix('prayer-requests')->name('prayer-requests.')->group(function () {
        Route::get('/', [PrayerController::class, 'index'])->name('index');
        Route::get('{uuid}', [PrayerController::class, 'show'])->name('show');
        Route::post('/', [PrayerController::class, 'store'])->name('store');
    });

    // Public contact form
    Route::post('contact', [ContactController::class, 'store'])->name('contact.store');

    // -----------------------------------------------------------------------
    // AUTH — throttled at 10 attempts/minute to prevent brute force
    // -----------------------------------------------------------------------
    Route::prefix('auth')->middleware('throttle:5,1')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('auth.forgot-password');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');
    });

    // -----------------------------------------------------------------------
    // PROTECTED — requires valid Sanctum token
    // -----------------------------------------------------------------------
    Route::middleware(['compress', 'auth:sanctum', 'throttle:api'])->group(function () {

        // Auth
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('me', [AuthController::class, 'me'])->name('me');
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('logout-all', [AuthController::class, 'logoutAll'])->name('logout-all');
            Route::post('change-password', [AuthController::class, 'changePassword'])
                ->name('change-password')
                ->middleware('throttle:3,1');
        });

        // Admin Dashboard
        Route::prefix('admin')->name('admin.')->group(function () {
            Route::get('dashboard', [DashboardController::class, 'stats'])->name('dashboard');

            // Admin Songs management
            Route::prefix('songs')->name('songs.')->group(function () {
                Route::get('/', [SongController::class, 'adminIndex'])->name('index');
                Route::post('/', [SongController::class, 'store'])->name('store');
                Route::put('{id}', [SongController::class, 'update'])->name('update');
                Route::delete('{id}', [SongController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-publish', [SongController::class, 'togglePublish'])->name('toggle-publish');
                Route::patch('{id}/toggle-featured', [SongController::class, 'toggleFeatured'])->name('toggle-featured');
                Route::post('{id}/duplicate', [SongController::class, 'duplicate'])->name('duplicate');
            });

            // Admin Song Categories management
            Route::prefix('song-categories')->name('song-categories.')->group(function () {
                Route::post('/', [SongCategoryController::class, 'store'])->name('store');
                Route::get('{id}', [SongCategoryController::class, 'show'])->name('show');
                Route::put('{id}', [SongCategoryController::class, 'update'])->name('update');
                Route::delete('{id}', [SongCategoryController::class, 'destroy'])->name('destroy');
            });

            // Admin Sermons management
            Route::prefix('sermons')->name('sermons.')->group(function () {
                Route::get('/', [SermonController::class, 'adminIndex'])->name('index');
                Route::post('/', [SermonController::class, 'store'])->name('store');
                Route::put('{id}', [SermonController::class, 'update'])->name('update');
                Route::delete('{id}', [SermonController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-publish', [SermonController::class, 'togglePublish'])->name('toggle-publish');
                Route::patch('{id}/toggle-featured', [SermonController::class, 'toggleFeatured'])->name('toggle-featured');
                Route::post('{id}/duplicate', [SermonController::class, 'duplicate'])->name('duplicate');
            });

            // Admin Speakers management
            Route::prefix('speakers')->name('speakers.')->group(function () {
                Route::get('/', [SpeakerController::class, 'adminIndex'])->name('index');
                Route::post('/', [SpeakerController::class, 'store'])->name('store');
                Route::get('{id}', [SpeakerController::class, 'show'])->name('show');
                Route::put('{id}', [SpeakerController::class, 'update'])->name('update');
                Route::delete('{id}', [SpeakerController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [SpeakerController::class, 'toggleStatus'])->name('toggle-status');
            });

            // Admin Sermon Series management
            Route::prefix('sermon-series')->name('sermon-series.')->group(function () {
                Route::get('/', [SermonSeriesController::class, 'adminIndex'])->name('index');
                Route::post('/', [SermonSeriesController::class, 'store'])->name('store');
                Route::get('{id}', [SermonSeriesController::class, 'show'])->name('show');
                Route::put('{id}', [SermonSeriesController::class, 'update'])->name('update');
                Route::delete('{id}', [SermonSeriesController::class, 'destroy'])->name('destroy');
            });

            // Admin Sermon Categories management
            Route::prefix('sermon-categories')->name('sermon-categories.')->group(function () {
                Route::get('/', [SermonCategoryController::class, 'adminIndex'])->name('adminIndex');
                Route::post('/', [SermonCategoryController::class, 'store'])->name('store');
                Route::get('{id}', [SermonCategoryController::class, 'show'])->name('show');
                Route::put('{id}', [SermonCategoryController::class, 'update'])->name('update');
                Route::delete('{id}', [SermonCategoryController::class, 'destroy'])->name('destroy');
            });

            // Admin Blog management
            Route::prefix('blogs')->name('blogs.')->group(function () {
                Route::get('/', [BlogController::class, 'adminIndex'])->name('index');
                Route::post('/', [BlogController::class, 'store'])->name('store');
                Route::put('{id}', [BlogController::class, 'update'])->name('update');
                Route::delete('{id}', [BlogController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-publish', [BlogController::class, 'togglePublish'])->name('toggle-publish');
                Route::patch('{id}/toggle-featured', [BlogController::class, 'toggleFeatured'])->name('toggle-featured');
                Route::post('{id}/duplicate', [BlogController::class, 'duplicate'])->name('duplicate');
            });

            // Admin Blog Categories management
            Route::prefix('blog-categories')->name('blog-categories.')->group(function () {
                Route::get('/', [BlogCategoryController::class, 'adminIndex'])->name('adminIndex');
                Route::post('/', [BlogCategoryController::class, 'store'])->name('store');
                Route::get('{id}', [BlogCategoryController::class, 'show'])->name('show');
                Route::put('{id}', [BlogCategoryController::class, 'update'])->name('update');
                Route::delete('{id}', [BlogCategoryController::class, 'destroy'])->name('destroy');
            });

            // Admin Events management
            Route::prefix('events')->name('events.')->group(function () {
                Route::get('/', [EventController::class, 'adminIndex'])->name('index');
                Route::post('/', [EventController::class, 'store'])->name('store');
                Route::put('{id}', [EventController::class, 'update'])->name('update');
                Route::delete('{id}', [EventController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-publish', [EventController::class, 'togglePublish'])->name('toggle-publish');
                Route::patch('{id}/toggle-featured', [EventController::class, 'toggleFeatured'])->name('toggle-featured');
                Route::post('{id}/duplicate', [EventController::class, 'duplicate'])->name('duplicate');
                Route::patch('{id}/cancel', [EventController::class, 'cancel'])->name('cancel');
            });

            // Admin Event Categories management
            Route::prefix('event-categories')->name('event-categories.')->group(function () {
                Route::get('/', [EventCategoryController::class, 'adminIndex'])->name('adminIndex');
                Route::post('/', [EventCategoryController::class, 'store'])->name('store');
                Route::get('{id}', [EventCategoryController::class, 'show'])->name('show');
                Route::put('{id}', [EventCategoryController::class, 'update'])->name('update');
                Route::delete('{id}', [EventCategoryController::class, 'destroy'])->name('destroy');
            });

            // Admin Ministries management
            Route::prefix('ministries')->name('ministries.')->group(function () {
                Route::get('/', [MinistryController::class, 'adminIndex'])->name('index');
                Route::post('/', [MinistryController::class, 'store'])->name('store');
                Route::put('{id}', [MinistryController::class, 'update'])->name('update');
                Route::delete('{id}', [MinistryController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-publish', [MinistryController::class, 'togglePublish'])->name('toggle-publish');
                Route::patch('{id}/toggle-featured', [MinistryController::class, 'toggleFeatured'])->name('toggle-featured');
                Route::post('{id}/duplicate', [MinistryController::class, 'duplicate'])->name('duplicate');
                Route::patch('{id}/reorder', [MinistryController::class, 'reorder'])->name('reorder');
            });

            // Admin Ministry Categories management
            Route::prefix('ministry-categories')->name('ministry-categories.')->group(function () {
                Route::get('/', [MinistryCategoryController::class, 'adminIndex'])->name('adminIndex');
                Route::post('/', [MinistryCategoryController::class, 'store'])->name('store');
                Route::get('{id}', [MinistryCategoryController::class, 'show'])->name('show');
                Route::put('{id}', [MinistryCategoryController::class, 'update'])->name('update');
                Route::delete('{id}', [MinistryCategoryController::class, 'destroy'])->name('destroy');
            });

            // Admin Prayer Requests management
            Route::prefix('prayer-requests')->name('prayer-requests.')->group(function () {
                Route::get('/', [PrayerController::class, 'adminIndex'])->name('index');
                Route::get('{id}', [PrayerController::class, 'adminShow'])->name('show');
                Route::put('{id}', [PrayerController::class, 'update'])->name('update');
                Route::delete('{id}', [PrayerController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/status', [PrayerController::class, 'updateStatus'])->name('status');
                Route::get('stats', [PrayerController::class, 'stats'])->name('stats');
            });

            // Admin Contact Messages management
            Route::prefix('contact-messages')->name('contact-messages.')->group(function () {
                Route::get('/', [ContactController::class, 'adminIndex'])->name('index');
                Route::get('{id}', [ContactController::class, 'adminShow'])->name('show');
                Route::put('{id}', [ContactController::class, 'update'])->name('update');
                Route::delete('{id}', [ContactController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/status', [ContactController::class, 'updateStatus'])->name('status');
                Route::get('stats', [ContactController::class, 'stats'])->name('stats');
            });
        });

        // Users
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('{uuid}', [UserController::class, 'show'])->name('show');
            Route::put('{uuid}', [UserController::class, 'update'])->name('update');
            Route::delete('{uuid}', [UserController::class, 'destroy'])->name('destroy');
            Route::post('{uuid}/restore', [UserController::class, 'restore'])->name('restore');
            Route::patch('{uuid}/toggle-status', [UserController::class, 'toggleStatus'])->name('toggle-status');
            Route::post('{uuid}/reset-password', [UserController::class, 'sendPasswordReset'])->name('reset-password');
        });

        // Roles & Permissions
        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->name('index');
            Route::get('{id}', [RoleController::class, 'show'])->name('show');
            Route::put('{id}/permissions', [RoleController::class, 'updatePermissions'])->name('permissions.update');
        });
        Route::get('permissions', [RoleController::class, 'permissions'])->name('permissions.index');

        // Church Settings
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('church', [ChurchSettingController::class, 'index'])->name('church.index');
            Route::put('church', [ChurchSettingController::class, 'update'])->name('church.update');
        });

        // Audit Logs
        Route::prefix('audit-logs')->name('audit-logs.')->group(function () {
            Route::get('/', [AuditLogController::class, 'index'])->name('index');
            Route::get('{id}', [AuditLogController::class, 'show'])->name('show');
        });

        // Media
        Route::prefix('media')->name('media.')->group(function () {
            Route::get('/', [MediaController::class, 'index'])->name('index');
            Route::post('/', [MediaController::class, 'store'])->name('store');
            Route::get('{uuid}', [MediaController::class, 'show'])->name('show');
            Route::get('{uuid}/signed-url', [MediaController::class, 'getSignedUrl'])->name('signed-url');
            Route::put('{uuid}', [MediaController::class, 'update'])->name('update');
            Route::delete('{uuid}', [MediaController::class, 'destroy'])->name('destroy');
            Route::get('stats', [MediaController::class, 'stats'])->name('stats');
        });

        // Notifications
        Route::prefix('notifications')->name('notifications.')->group(function () {
            Route::get('/', [NotificationController::class, 'index'])->name('index');
            Route::get('unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
            Route::patch('{id}/read', [NotificationController::class, 'markAsRead'])->name('mark-read');
            Route::post('mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
            Route::delete('{id}', [NotificationController::class, 'destroy'])->name('destroy');
        });

        // Navigation Management
        Route::prefix('navigation')->name('navigation.')->group(function () {
            Route::get('/', [NavigationController::class, 'index'])->name('index');
            Route::post('/', [NavigationController::class, 'store'])->name('store');
            Route::put('{id}', [NavigationController::class, 'update'])->name('update');
            Route::delete('{id}', [NavigationController::class, 'destroy'])->name('destroy');
            Route::post('items', [NavigationController::class, 'storeItem'])->name('items.store');
            Route::put('items/{id}', [NavigationController::class, 'updateItem'])->name('items.update');
            Route::delete('items/{id}', [NavigationController::class, 'destroyItem'])->name('items.destroy');
            Route::post('{menuId}/reorder', [NavigationController::class, 'reorderItems'])->name('items.reorder');
        });

        // Homepage CMS
        Route::prefix('homepage')->name('homepage.')->group(function () {
            Route::get('/', [HomepageController::class, 'index'])->name('index');
            Route::get('{key}', [HomepageController::class, 'show'])->name('show');
            Route::post('/', [HomepageController::class, 'store'])->name('store');
            Route::put('{id}', [HomepageController::class, 'update'])->name('update');
            Route::delete('{id}', [HomepageController::class, 'destroy'])->name('destroy');
            Route::post('reorder', [HomepageController::class, 'reorder'])->name('reorder');
            Route::post('initialize', [HomepageController::class, 'initialize'])->name('initialize');
        });

        // Footer Management
        Route::prefix('footer')->name('footer.')->group(function () {
            Route::get('/', [FooterController::class, 'index'])->name('index');
            Route::get('{key}', [FooterController::class, 'show'])->name('show');
            Route::post('/', [FooterController::class, 'store'])->name('store');
            Route::put('{id}', [FooterController::class, 'update'])->name('update');
            Route::post('batch', [FooterController::class, 'updateBatch'])->name('batch');
            Route::delete('{id}', [FooterController::class, 'destroy'])->name('destroy');
            Route::post('initialize', [FooterController::class, 'initialize'])->name('initialize');
        });

        // Search
        Route::prefix('search')->name('search.')->group(function () {
            Route::get('/', [SearchController::class, 'global'])->name('global');
            Route::get('{type}', [SearchController::class, 'byType'])->name('by-type');
        });
    });
});
