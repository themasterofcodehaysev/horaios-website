# Monitoring and Error Tracking Setup Guide

## Current Implementation

### Error Tracking Service
- **Created**: `app/Services/ErrorTrackingService.php`
- **Features**:
  - Error logging with full context
  - Performance monitoring
  - Security event tracking
  - User and request context

### Health Check Endpoint
- **Enhanced**: `app/Http/Controllers/Api/HealthController.php`
- **Features**:
  - Database connection check
  - Cache connection check
  - Storage operation check
  - Queue status check
  - Filesystem usage monitoring
  - Memory usage monitoring
  - Redis connection check
  - Environment and version reporting

## Production Monitoring Recommendations

### 1. Error Tracking Services
Consider implementing one of these services for production:

#### Sentry (Recommended)
```bash
composer require sentry/sentry-laravel
php artisan vendor:publish --provider="Sentry\SentryLaravelServiceProvider"
```

**Configuration**:
```env
SENTRY_DSN=https://your-sentry-dsn
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_ENVIRONMENT=production
```

#### Bugsnag
```bash
composer require bugsnag/bugsnag-laravel
```

#### Rollbar
```bash
composer require rollbar/rollbar-laravel
```

### 2. Performance Monitoring

#### New Relic
- APM (Application Performance Monitoring)
- Database query analysis
- Response time tracking
- Error rate monitoring

#### Datadog
- Full-stack monitoring
- Infrastructure monitoring
- Log aggregation
- Custom dashboards

### 3. Log Aggregation

#### ELK Stack (Elasticsearch, Logstash, Kibana)
- Centralized logging
- Real-time log analysis
- Custom dashboards

#### Papertrail
- Simple log aggregation
- Real-time log streaming
- Alerting

### 4. Server Monitoring

#### AWS CloudWatch
- CPU usage
- Memory usage
- Disk space
- Network traffic
- Custom metrics

#### Prometheus + Grafana
- Custom metrics collection
- Beautiful dashboards
- Alerting

## Implementation Steps

### Step 1: Enable Error Tracking Service
```php
// In your controllers or services
use App\Services\ErrorTrackingService;

class ExampleController extends Controller
{
    public function __construct(
        private ErrorTrackingService $errorTracking
    ) {}

    public function someMethod()
    {
        try {
            // Your code here
        } catch (Throwable $e) {
            $this->errorTracking->logError($e, [
                'additional_context' => 'value'
            ]);
            throw $e;
        }
    }
}
```

### Step 2: Monitor Performance
```php
$start = microtime(true);
// Your operation here
$duration = microtime(true) - $start;

$this->errorTracking->logPerformance('operation_name', $duration, [
    'items_processed' => $count,
]);
```

### Step 3: Track Security Events
```php
$this->errorTracking->logSecurityEvent('failed_login_attempt', [
    'email' => $email,
    'attempts' => $attempts,
]);
```

### Step 4: Set Up Health Check Monitoring
```bash
# Add to crontab for monitoring
*/5 * * * * curl -f http://your-domain.com/api/v1/health || echo "Health check failed"
```

### Step 5: Configure Logging
```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
    ],
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14,
    ],
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Horaios Bot',
        'emoji' => ':boom:',
        'level' => 'error',
    ],
],
```

## Alerting Configuration

### Critical Alerts
- Application down (health check fails)
- Error rate > 5%
- Response time > 2s
- Database connection fails
- Disk usage > 90%
- Memory usage > 80%

### Warning Alerts
- Error rate > 1%
- Response time > 1s
- Queue size > 1000
- Redis connection fails
- Cache hit rate < 80%

## Dashboard Metrics to Monitor

### Application Metrics
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate
- User activity
- Feature usage

### Infrastructure Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network I/O
- Database connections
- Queue workers status

### Business Metrics
- New registrations
- Content published
- Active users
- Prayer requests
- Contact messages

## Log Rotation Setup

### Linux/Ubuntu
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/horaios

# Content:
/path/to/horaios-website/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    sharedscripts
    postrotate
        php /path/to/horaios-website/artisan log:clear
    endscript
}
```

## Backup Monitoring

### Database Backups
- Monitor backup completion
- Check backup file size
- Verify backup integrity
- Alert on backup failures

### Application Backups
- Monitor file backup completion
- Check storage usage
- Verify backup integrity

## Security Monitoring

### Failed Login Attempts
- Monitor rate of failed logins
- Alert on suspicious patterns
- IP-based blocking

### API Rate Limiting
- Monitor rate limit violations
- Identify API abuse
- Adjust rate limits as needed

## Recommendations

### Immediate (Pre-Deployment)
1. ✅ Error tracking service implemented
2. ✅ Enhanced health check endpoint
3. ⚠️ Configure error tracking service (Sentry/Bugsnag)
4. ⚠️ Set up log aggregation
5. ⚠️ Configure monitoring dashboards

### Post-Deployment
1. Set up CloudWatch for AWS monitoring
2. Configure Sentry for error tracking
3. Set up log rotation
4. Configure alerting rules
5. Create monitoring dashboards
6. Implement backup monitoring
7. Set up performance monitoring

### Ongoing
1. Review error logs daily
2. Monitor performance metrics
3. Update alerting thresholds
4. Review backup status
5. Optimize based on monitoring data

## Current Status
- ✅ Error tracking service created
- ✅ Enhanced health check endpoint
- ✅ Performance monitoring hooks
- ✅ Security event logging
- ⚠️ Production error tracking service configuration needed
- ⚠️ External monitoring service integration needed
- ⚠️ Alerting configuration needed

The foundation for comprehensive monitoring is in place. Production deployment should include configuration of external monitoring services for full coverage.
