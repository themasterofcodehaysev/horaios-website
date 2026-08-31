<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Throwable;

class ErrorTrackingService
{
    /**
     * Log error with context information
     */
    public function logError(Throwable $exception, array $context = []): void
    {
        $errorData = [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'code' => $exception->getCode(),
            'trace' => $exception->getTraceAsString(),
            'url' => Request::fullUrl(),
            'method' => Request::method(),
            'ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
            'context' => $context,
        ];

        Log::error('Application Error', $errorData);
    }

    /**
     * Log performance data
     */
    public function logPerformance(string $action, float $duration, array $metadata = []): void
    {
        $performanceData = [
            'action' => $action,
            'duration_ms' => round($duration * 1000, 2),
            'url' => Request::fullUrl(),
            'method' => Request::method(),
            'ip' => Request::ip(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
            'metadata' => $metadata,
        ];

        Log::info('Performance Data', $performanceData);
    }

    /**
     * Log security events
     */
    public function logSecurityEvent(string $event, array $details = []): void
    {
        $securityData = [
            'event' => $event,
            'details' => $details,
            'url' => Request::fullUrl(),
            'method' => Request::method(),
            'ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
        ];

        Log::warning('Security Event', $securityData);
    }

    /**
     * Get error statistics
     */
    public function getErrorStats(int $hours = 24): array
    {
        // This would be enhanced with actual database logging in production
        return [
            'total_errors' => 0,
            'error_rate' => 0,
            'common_errors' => [],
            'recent_errors' => [],
        ];
    }
}
