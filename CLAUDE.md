# Karfani - Project Context

## Overview
Karfani (كرفاني) is a Saudi caravan rental platform - the first dedicated caravan/RV rental marketplace in the Gulf region. Built as a monorepo with Turborepo + pnpm workspaces.

## Architecture
- **packages/api** - NestJS 11 backend (18 modules), Prisma 6.6, PostgreSQL 16
- **packages/shared** - Shared types, Zod schemas, utilities
- **packages/database** - Prisma schema + migrations
- **apps/web** - Next.js 15 (App Router), React 19, Tailwind CSS v4, i18n (ar/en)
- **apps/admin** - Next.js 15 admin dashboard

## Key Commands
```bash
pnpm dev          # Start all services (turbo)
pnpm build        # Build all packages
pnpm test         # Run all tests (Vitest)
pnpm test:coverage # Run tests with coverage
pnpm lint         # Lint all packages
pnpm db:migrate   # Run Prisma migrations
pnpm db:seed      # Seed database
pnpm db:studio    # Open Prisma Studio
```

## Conventions
- **Language**: Arabic-first UI (RTL), English code
- **Styling**: Tailwind CSS v4 with brand colors (olive #4A5D3A, copper #C67B3C, sand, cream)
- **State**: TanStack Query for server state, React hooks for local state
- **Auth**: JWT + OTP via SMS (Unifonic)
- **Payments**: Moyasar (mada, Visa, Apple Pay)
- **Testing**: Vitest for unit/integration tests
- **API Docs**: Swagger at /api/docs

## Backend Modules
auth, users, inventory, booking, payments, reviews, analytics, notifications, content, upload, contracts, inspection, damage, maintenance, dispatch, support, admin, health

## Environment Variables
See `docker-compose.yml` and `.env.example` for required vars:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection  
- `JWT_SECRET` - Auth token signing
- `MOYASAR_API_KEY` - Payment gateway
- `UNIFONIC_APP_SID` - SMS service
- `SENTRY_DSN` - Error tracking
