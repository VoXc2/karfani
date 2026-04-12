# كرفاني | Karfani

> Saudi Arabia's first dedicated caravan/RV rental marketplace - connecting caravan owners with adventure seekers across the Gulf region.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS 11, Prisma 6.6, PostgreSQL 16, Redis 7, Bull queues |
| **Web App** | Next.js 15 (App Router), React 19, Tailwind CSS v4, TanStack Query |
| **Admin** | Next.js 15, React 19, Tailwind CSS v4, Recharts |
| **Mobile** | React Native (Expo), TypeScript |
| **Shared** | TypeScript, Zod schemas, utility functions |
| **Infrastructure** | Docker Compose, GitHub Actions CI/CD, MinIO (S3) |
| **Payments** | Moyasar (mada, Visa, Apple Pay) |
| **SMS/WhatsApp** | Unifonic |

## Architecture

```
karfani/
├── apps/
│   ├── web/          # Customer-facing Next.js web app (Arabic RTL)
│   ├── admin/        # Admin dashboard
│   └── mobile/       # React Native (Expo) mobile app
├── packages/
│   ├── api/          # NestJS backend (18 modules)
│   ├── shared/       # Shared types, schemas, utilities
│   └── database/     # Prisma schema & migrations
├── docs/             # Investor docs, deployment guides
└── e2e/              # End-to-end tests (Playwright)
```

## Quick Start

```bash
# Prerequisites: Node.js 20+, pnpm 10+, Docker

# 1. Clone and install
git clone https://github.com/voxc2/karfani.git
cd karfani
pnpm install

# 2. Start infrastructure
docker compose up -d postgres redis minio

# 3. Set up database
pnpm db:migrate
pnpm db:seed

# 4. Start development
pnpm dev
```

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Customer web app |
| Admin | http://localhost:3001 | Admin dashboard |
| API | http://localhost:4000 | REST API |
| Swagger | http://localhost:4000/api/docs | API documentation |
| MinIO | http://localhost:9001 | Object storage console |

## Commands

```bash
pnpm dev            # Start all services
pnpm build          # Build all packages
pnpm test           # Run all tests
pnpm test:coverage  # Run tests with coverage
pnpm lint           # Lint all packages
pnpm db:migrate     # Run database migrations
pnpm db:seed        # Seed database
pnpm db:studio      # Open Prisma Studio
```

## Backend Modules (18)

`auth` `users` `inventory` `booking` `payments` `pricing` `availability` `reviews` `analytics` `notifications` `content` `upload` `contracts` `inspection` `damage` `maintenance` `dispatch` `support` `admin` `promo` `health`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://karfani:karfani@localhost:5432/karfani
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
MOYASAR_API_KEY=sk_test_...
MOYASAR_WEBHOOK_SECRET=...
UNIFONIC_APP_SID=...
SENTRY_DSN=...
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guide.

```bash
# Build Docker images
docker compose build

# Run in production
docker compose -f docker-compose.yml up -d
```

## License

Private - All rights reserved.
