<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChurchSettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\RoleController;
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
Route::prefix('v1')->group(function () {

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

    // -----------------------------------------------------------------------
    // AUTH — throttled at 10 attempts/minute to prevent brute force
    // -----------------------------------------------------------------------
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->name('auth.login');
    });

    // -----------------------------------------------------------------------
    // PROTECTED — requires valid Sanctum token
    // -----------------------------------------------------------------------
    Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {

        // Auth
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('me', [AuthController::class, 'me'])->name('me');
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('logout-all', [AuthController::class, 'logoutAll'])->name('logout-all');
            Route::post('change-password', [AuthController::class, 'changePassword'])->name('change-password');
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
        });

        // Users
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('{uuid}', [UserController::class, 'show'])->name('show');
            Route::put('{uuid}', [UserController::class, 'update'])->name('update');
            Route::delete('{uuid}', [UserController::class, 'destroy'])->name('destroy');
            Route::post('{uuid}/restore', [UserController::class, 'restore'])->name('restore');
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
            Route::delete('{uuid}', [MediaController::class, 'destroy'])->name('destroy');
        });
    });
});
