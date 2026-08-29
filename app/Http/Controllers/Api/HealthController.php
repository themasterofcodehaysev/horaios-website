<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Queue;

class HealthController extends BaseApiController
{
    public function check(): JsonResponse
    {
        $health = [
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'checks' => [
                'database' => $this->checkDatabase(),
                'cache' => $this->checkCache(),
                'storage' => $this->checkStorage(),
                'queue' => $this->checkQueue(),
                'filesystem' => $this->checkFilesystem(),
            ],
        ];

        $allHealthy = collect($health['checks'])->every(fn($check) => $check['status'] === 'ok');
        $health['status'] = $allHealthy ? 'healthy' : 'degraded';

        return $this->success($health, 'Health check completed', $allHealthy ? 200 : 503);
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'ok', 'message' => 'Database connection successful'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()];
        }
    }

    private function checkCache(): array
    {
        try {
            Cache::put('health_check', 'ok', 10);
            $value = Cache::get('health_check');
            return ['status' => 'ok', 'message' => 'Cache connection successful'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Cache connection failed: ' . $e->getMessage()];
        }
    }

    private function checkStorage(): array
    {
        try {
            Storage::disk('local')->put('health_check.txt', 'ok');
            Storage::disk('local')->delete('health_check.txt');
            return ['status' => 'ok', 'message' => 'Storage write successful'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Storage operation failed: ' . $e->getMessage()];
        }
    }

    private function checkQueue(): array
    {
        try {
            $size = Queue::size();
            return ['status' => 'ok', 'message' => 'Queue connection successful', 'pending_jobs' => $size];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Queue connection failed: ' . $e->getMessage()];
        }
    }

    private function checkFilesystem(): array
    {
        $freeSpace = disk_free_space(storage_path());
        $totalSpace = disk_total_space(storage_path());
        $usedSpace = $totalSpace - $freeSpace;
        $usagePercent = ($usedSpace / $totalSpace) * 100;

        return [
            'status' => $usagePercent < 90 ? 'ok' : 'warning',
            'message' => 'Filesystem check',
            'usage_percent' => round($usagePercent, 2),
            'free_space' => round($freeSpace / 1024 / 1024 / 1024, 2) . ' GB',
            'total_space' => round($totalSpace / 1024 / 1024 / 1024, 2) . ' GB',
        ];
    }
}
