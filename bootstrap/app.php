<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Sanctum SPA middleware (for cookie-based auth if needed later)
        $middleware->statefulApi();
        
        // Apply security headers to all routes
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        
        // Apply response compression to API routes
        $middleware->alias([
            'compress' => \App\Http\Middleware\CompressResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Return JSON for unauthenticated API requests instead of redirect
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please provide a valid Bearer token.',
                ], 401);
            }
        });

        // Return JSON for authorization failures on API routes.
        // Note: Laravel's Handler::prepareException() converts AuthorizationException
        // to AccessDeniedHttpException before any render() callback sees it, so this
        // must be registered against the converted type, not AuthorizationException.
        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to perform this action.',
                ], 403);
            }
        });

        // Return JSON for model-not-found / unmatched-route 404s on API routes.
        // Same conversion caveat as above: ModelNotFoundException is turned into
        // NotFoundHttpException before reaching here.
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'The requested resource was not found.',
                ], 404);
            }
        });

        // Return JSON for validation errors on API routes
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });
    })->create();
