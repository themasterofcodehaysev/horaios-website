<?php

use Illuminate\Support\Facades\Route;

// Serve the SPA for all routes — React Router handles client-side navigation
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
