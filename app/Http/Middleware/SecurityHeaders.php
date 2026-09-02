<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('Content-Security-Policy', $this->buildContentSecurityPolicy());

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Prevent clickjacking (allow same-origin iframes for maps)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Enable XSS protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // HSTS (only in production with HTTPS)
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 
            'geolocation=(), ' .
            'microphone=(), ' .
            'camera=(), ' .
            'payment=(), ' .
            'usb=()'
        );

        return $response;
    }

    private function buildContentSecurityPolicy(): string
    {
        $viteDevOrigins = '';
        $workerSrc = "worker-src 'self'";

        if (app()->environment('local')) {
            $viteDevOrigins = implode(' ', [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'ws://localhost:5173',
                'ws://127.0.0.1:5173',
            ]);
            $workerSrc = "worker-src 'self' blob: {$viteDevOrigins}";
        }

        return implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net {$viteDevOrigins}",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com {$viteDevOrigins}",
            "img-src 'self' data: https:",
            "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
            "connect-src 'self' {$viteDevOrigins}",
            $workerSrc,
            "media-src 'self'",
            "object-src 'none'",
            "frame-src 'self' https://www.google.com https://maps.google.com",
            "base-uri 'self'",
            "form-action 'self'",
        ]);
    }
}
