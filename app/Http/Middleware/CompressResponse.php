<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CompressResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only compress responses in production for API routes
        if (config('app.env') === 'production' && $request->is('api/*')) {
            $acceptEncoding = $request->header('Accept-Encoding', '');
            
            // Check if client accepts gzip compression
            if (str_contains($acceptEncoding, 'gzip')) {
                $content = $response->getContent();
                
                // Only compress if content is large enough (> 1KB)
                if (strlen($content) > 1024) {
                    $compressed = gzencode($content, 6);
                    
                    if ($compressed !== false) {
                        $response->setContent($compressed);
                        $response->headers->set('Content-Encoding', 'gzip');
                        $response->headers->set('Content-Length', strlen($compressed));
                        $response->headers->set('Vary', 'Accept-Encoding');
                        $response->headers->remove('Content-Length');
                    }
                }
            }
        }

        return $response;
    }
}
