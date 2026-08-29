<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class LoggingService
{
    public function logSecurityEvent(string $event, array $context = []): void
    {
        Log::channel('security')->warning($event, $context);
    }

    public function logAuthEvent(string $event, array $context = []): void
    {
        Log::channel('auth')->info($event, $context);
    }

    public function logApiRequest(string $method, string $endpoint, array $context = []): void
    {
        Log::channel('api')->info("API Request: {$method} {$endpoint}", $context);
    }

    public function logDatabaseQuery(string $query, float $time, array $bindings = []): void
    {
        if ($time > 100) { // Log slow queries > 100ms
            Log::channel('database')->warning('Slow Query', [
                'query' => $query,
                'time' => $time,
                'bindings' => $bindings,
            ]);
        }
    }

    public function logQueueJob(string $job, string $status, array $context = []): void
    {
        Log::channel('queue')->info("Queue Job: {$job} - {$status}", $context);
    }

    public function logEmailSent(string $to, string $subject, array $context = []): void
    {
        Log::channel('mail')->info("Email sent to {$to}", [
            'subject' => $subject,
            'context' => $context,
        ]);
    }

    public function logAuditEvent(string $action, string $model, string $modelId, array $context = []): void
    {
        Log::channel('audit')->info("Audit: {$action} on {$model} #{$modelId}", $context);
    }

    public function logError(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }

    public function logCritical(string $message, array $context = []): void
    {
        Log::critical($message, $context);
    }
}
