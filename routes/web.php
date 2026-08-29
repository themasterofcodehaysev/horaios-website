<?php

use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

// Sitemap routes (must come before SPA catch-all)
Route::prefix('sitemap')->name('sitemap.')->group(function () {
    Route::get('/', [SitemapController::class, 'index'])->name('index');
    Route::get('/main.xml', [SitemapController::class, 'main'])->name('main');
    Route::get('/sermons.xml', [SitemapController::class, 'sermons'])->name('sermons');
    Route::get('/songs.xml', [SitemapController::class, 'songs'])->name('songs');
    Route::get('/blog.xml', [SitemapController::class, 'blog'])->name('blog');
    Route::get('/events.xml', [SitemapController::class, 'events'])->name('events');
    Route::get('/ministries.xml', [SitemapController::class, 'ministries'])->name('ministries');
});

// Robots.txt
Route::get('/robots.txt', function () {
    $content = "User-agent: *\n";
    $content .= "Allow: /\n";
    $content .= "Disallow: /admin/\n";
    $content .= "Disallow: /api/\n";
    $content .= "Disallow: /storage/\n";
    $content .= "\n";
    $content .= "Sitemap: " . url('/sitemap') . "\n";
    
    return response($content, 200)->header('Content-Type', 'text/plain');
});

// Serve the SPA for all routes — React Router handles client-side navigation
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
