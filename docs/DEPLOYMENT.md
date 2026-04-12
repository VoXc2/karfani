# Karfani - Deployment Guide

## Prerequisites

- Docker 24+ with Docker Compose v2
- Node.js 20+ (for local development)
- PostgreSQL 16
- Redis 7
- S3-compatible storage (MinIO or AWS S3)

## Environment Setup

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/karfani

# Redis
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=<generate with: openssl rand -hex 32>
JWT_REFRESH_SECRET=<generate with: openssl rand -hex 32>
OTP_EXPIRY_MINUTES=5

# API
API_PORT=4000
NODE_ENV=production
WEB_URL=https://karfani.com
ADMIN_URL=https://admin.karfani.com

# Payments (Moyasar)
MOYASAR_API_KEY=sk_live_...
MOYASAR_WEBHOOK_SECRET=...

# SMS (Unifonic)
UNIFONIC_APP_SID=...

# Storage (S3/MinIO)
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=karfani-uploads
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

## Docker Deployment

```bash
# Build images
docker compose build

# Run database migrations
docker compose run --rm api npx prisma migrate deploy

# Start all services
docker compose up -d

# Check health
curl http://localhost:4000/api/v1/health
```

## Production Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Configure Moyasar webhook URL
- [ ] Configure Unifonic sender ID
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up Sentry for error tracking
- [ ] Configure backup schedule for PostgreSQL
- [ ] Set up monitoring alerts
- [ ] Test payment flow in production
- [ ] Verify SMS delivery
