# AWS Deployment Guide
## Horaios Baptist Church Management System

### Executive Summary
This guide provides comprehensive instructions for deploying the Laravel + React Church Management System to AWS infrastructure for production use.

---

## 1. Architecture Overview

### 1.1 Infrastructure Components
- **AWS EC2**: Application server (Ubuntu 22.04 LTS)
- **Amazon RDS**: MySQL database (Aurora MySQL recommended)
- **Amazon S3**: Media storage and static assets
- **CloudFront**: CDN for static assets and media
- **Route 53**: DNS management
- **Amazon SES**: Email service
- **Elastic Load Balancer**: Load balancing (optional for scaling)
- **AWS Certificate Manager**: SSL certificates

### 1.2 Network Architecture
```
User → CloudFront → ELB → EC2 → RDS
              ↓              ↓
              S3            ElastiCache (Redis)
```

---

## 2. Prerequisites

### 2.1 AWS Account Setup
- AWS account with appropriate permissions
- IAM user with administrative access
- AWS CLI installed and configured
- SSH key pair created

### 2.2 Domain Setup
- Domain registered (or Route 53 hosted zone)
- SSL certificate requested (ACM)

### 2.3 Local Preparation
- Application code ready for deployment
- Environment variables configured
- Database backup ready
- Migration scripts tested

---

## 3. EC2 Server Setup

### 3.1 Instance Launch
```bash
# Launch Ubuntu 22.04 LTS instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxx \
  --subnet-id subnet-xxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=horaios-church}]'
```

### 3.2 Security Groups
```bash
# Create security group
aws ec2 create-security-group \
  --group-name horaios-church-sg \
  --description "Security group for Horaios Church application"

# Allow HTTP (80)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS (443)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow SSH (22) - restrict to your IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_IP/32
```

### 3.3 Server Configuration
```bash
# SSH into server
ssh -i your-key.pem ubuntu@YOUR_SERVER_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx mysql-client curl git unzip

# Install PHP 8.3
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.3 php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-gd

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

---

## 4. Database Setup (Amazon RDS)

### 4.1 Create RDS Instance
```bash
aws rds create-db-instance \
  --db-instance-identifier horaios-church-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name default \
  --publicly-accessible \
  --backup-retention-period 7 \
  --multi-az false
```

### 4.2 Database Configuration
```env
# .env file
DB_CONNECTION=mysql
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=horaios_church
DB_USERNAME=admin
DB_PASSWORD=YOUR_SECURE_PASSWORD
```

---

## 5. S3 Storage Setup

### 5.1 Create S3 Bucket
```bash
aws s3api create-bucket \
  --bucket horaios-church-media \
  --region us-east-1 \
  --create-bucket-configuration LocationConstraint=us-east-1
```

### 5.2 Configure S3 Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::horaios-church-media/*"
    }
  ]
}
```

### 5.3 Laravel S3 Configuration
```php
// config/filesystems.php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
],
```

---

## 6. CloudFront CDN Setup

### 6.1 Create CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --origin-domain-name horaios-church-media.s3.amazonaws.com \
  --default-root-object index.php \
  --viewer-certificate-id YOUR_CERTIFICATE_ID \
  --aliases horaiosbaptist.org,www.horaiosbaptist.org
```

### 6.2 CloudFront Configuration
- Set default TTL to 86400 (24 hours)
- Enable compression
- Configure custom error pages
- Set up cache behaviors

---

## 7. Application Deployment

### 7.1 Deploy Laravel Application
```bash
# Clone repository
git clone https://github.com/your-repo/horaios-website.git
cd horaios-website

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Link storage
php artisan storage:link
```

### 7.2 Nginx Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name horaiosbaptist.org www.horaiosbaptist.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name horaiosbaptist.org www.horaiosbaptist.org;

    root /var/www/horaios-website/public;
    index index.php index.html;

    ssl_certificate /etc/ssl/certs/horaiosbaptist.crt;
    ssl_certificate_key /etc/ssl/private/horaiosbaptist.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Laravel location block
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### 7.3 Supervisor Configuration
```ini
[program:horaios-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/horaios-website/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/horaios-website/storage/logs/worker.log
```

---

## 8. Route 53 DNS Configuration

### 8.1 Create Hosted Zone
```bash
aws route53 create-hosted-zone \
  --name horaiosbaptist.org \
  --caller-reference production-$(date +%s)
```

### 8.2 Add DNS Records
```bash
# A record for root domain
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "horaiosbaptist.org",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [{"Value": "YOUR_SERVER_IP"}]
      }
    }]
  }'

# CNAME for www
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.horaiosbaptist.org",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "horaiosbaptist.org"}]
      }
    }]
  }'
```

---

## 9. Email Configuration (Amazon SES)

### 9.1 Verify Domain
```bash
aws ses verify-domain-identity --domain horaiosbaptist.org
```

### 9.2 Production Access Request
```bash
aws ses request-production-access \
  --identity horaiosbaptist.org \
  --use-case-from-display-name SendingTransactionalEmails \
  --use-case-from-display-website WebsiteHosting
```

### 9.3 Laravel Mail Configuration
```env
MAIL_MAILER=ses
MAIL_HOST=email.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=YOUR_SES_ACCESS_KEY
MAIL_PASSWORD=YOUR_SES_SECRET_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@horaiosbaptist.org
MAIL_FROM_NAME="Horaios Baptist Church"
```

---

## 10. SSL Certificate (ACM)

### 10.1 Request Certificate
```bash
aws acm request-certificate \
  --domain-name horaiosbaptist.org \
  --subject-alternative-names www.horaiosbaptist.org \
  --validation-method DNS
```

### 10.2 Validate Certificate
- Add CNAME records to Route 53
- Wait for validation
- Certificate becomes valid

---

## 11. Monitoring & Logging

### 11.1 CloudWatch Setup
```bash
# Enable detailed monitoring
aws ec2 monitor-instances --instance-ids i-xxxxxxxx

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name cpu-utilization \
  --alarm-description "Alert on CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### 11.2 Log Collection
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

---

## 12. Backup Strategy

### 12.1 Database Backups
- Automated daily backups (RDS feature)
- 7-day retention period
- Point-in-time recovery enabled
- Manual backup before major changes

### 12.2 Application Backups
```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
APP_DIR="/var/www/horaios-website"

# Create backup
tar -czf $BACKUP_DIR/horaios_$DATE.tar.gz $APP_DIR

# Upload to S3
aws s3 cp $BACKUP_DIR/horaios_$DATE.tar.gz s3://horaios-church-backups/

# Keep last 30 days
find $BACKUP_DIR -name "horaios_*.tar.gz" -mtime +30 -delete
```

### 12.3 Media Backups
- S3 versioning enabled
- Cross-region replication (optional)
- Regular export to local storage

---

## 13. Security Hardening

### 13.1 Server Security
```bash
# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 13.2 Application Security
```env
APP_ENV=production
APP_DEBUG=false
```

### 13.3 Database Security
- RDS encryption at rest enabled
- Strong password policy
- Regular password rotation
- Limited database user permissions

---

## 14. Scaling Strategy

### 14.1 Horizontal Scaling
- Use Auto Scaling Groups
- Configure load balancer
- Implement session sharing (Redis)
- Database read replicas

### 14.2 Vertical Scaling
- Monitor resource usage
- Scale instance types as needed
- Use Amazon RDS scaling
- Implement caching to reduce load

---

## 15. Deployment Checklist

### Pre-Deployment
- [ ] AWS account configured
- [ ] Domain purchased
- [ ] SSL certificate obtained
- [ ] Database backup created
- [ ] Application tested locally
- [ ] Environment variables configured

### Deployment
- [ ] EC2 instance launched
- [ ] Security groups configured
- [ ] Database created and configured
- [ ] S3 bucket created
- [ ] CloudFront distribution configured
- [ ] Route 53 DNS configured
- [ ] Application deployed
- [ ] SSL certificate installed
- [ ] Email service configured
- [ ] Queue workers configured
- [ ] Monitoring enabled

### Post-Deployment
- [ ] Test all functionality
- [ ] Verify SSL certificate
- [ ] Test email sending
- [ ] Verify database connections
- [ ] Test file uploads
- [ ] Monitor server resources
- [ ] Set up alerts
- [ ] Document access credentials
- [ ] Create runbook

---

## 16. Troubleshooting

### 16.1 Common Issues
- **502 Bad Gateway**: Check Nginx and PHP-FPM status
- **Database Connection**: Verify RDS security groups
- **SSL Issues**: Check certificate configuration
- **Permission Denied**: Verify file permissions
- **Queue Workers Not Running**: Check Supervisor status

### 16.2 Log Locations
- Application logs: `/var/www/horaios-website/storage/logs`
- Nginx logs: `/var/log/nginx/`
- PHP-FPM logs: `/var/log/php8.3-fpm/`
- Supervisor logs: `/var/log/supervisor/`

---

## 17. Cost Optimization

### 17.1 Estimated Monthly Costs
- EC2 (t3.medium): ~$25
- RDS (db.t3.micro): ~$15
- S3 Storage: ~$5
- CloudFront: ~$10
- Route 53: ~$1
- SES: ~$1 (free tier)
- **Total**: ~$57/month

### 17.2 Cost Saving Tips
- Use Reserved Instances for long-term
- Implement CloudFront caching
- Optimize database storage
- Use S3 lifecycle policies
- Monitor and optimize resource usage

---

## 18. Maintenance Schedule

### Daily
- Monitor server resources
- Check error logs
- Verify backups

### Weekly
- Review security updates
- Check disk space
- Monitor performance metrics

### Monthly
- Apply security patches
- Review and optimize costs
- Test disaster recovery
- Update documentation

### Quarterly
- Full security audit
- Performance review
- Capacity planning
- Architecture review

---

**Guide Created**: 2026-08-07
**Author**: Senior DevOps Engineer
**Last Updated**: 2026-08-07
