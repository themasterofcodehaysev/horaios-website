<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CompressResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only compress JSON responses in production
        if (config('app.env') === 'production' && $request->is('api/*')) {
            $response->headers->set('Content-Encoding', 'gzip');
            $response->headers->set('X-Content-Encoded-By', 'Laravel');
        }

        return $response;
    }
}
