# كرفاني (Karfani) — خطة تنفيذية شاملة

## Context

كرفاني هي منصة سعودية متخصصة لتأجير الكرفانات وتشغيلها وإدارة تجربة السفر البري والطبيعة. المشروع يبدأ من الصفر (مجلد فارغ). الهدف هو بناء منصة كاملة تشمل: موقع حجز للعملاء، تطبيق موبايل (عميل + مالك)، لوحة تشغيل داخلية، وباك إند متكامل يغطي 17 خدمة أساسية.

**لماذا الآن:** السياحة المحلية السعودية في نمو قوي (115.9 مليون سائح 2024)، دعم رسمي للوجهات الطبيعية، السوق الحالي مبعثر بدون متخصص vertical للكرفانات.

**الفجوة:** لا يوجد منصة سعودية متخصصة تجمع بين تأجير الكرفانات + تشغيلها + تجربة الرحلة + إدارة الملاك.

---

## 1. Tech Stack

| الطبقة | التقنية | السبب |
|--------|---------|-------|
| Web (عميل) | Next.js 15 (App Router) | SSR, i18n, RTL, image optimization |
| Web (أدمن) | Next.js 15 + shadcn/ui + TanStack Table | مشاركة كود مع الويب، admin UI سريع |
| Mobile | React Native + Expo SDK 52+ | مشاركة types مع Next.js، EAS builds |
| Backend | NestJS 11 (modular monolith) | TypeScript end-to-end، module architecture |
| Database | PostgreSQL 16 + PostGIS + Redis 7 | Geo queries، caching، queues |
| ORM | Prisma | Type-safe، migrations، seeding |
| Payments | Moyasar | mada, Apple Pay, STC Pay |
| SMS/WhatsApp | Unifonic | Saudi-based، Arabic |
| Maps | Google Maps Platform | Directions, Places, Maps SDK |
| Storage | AWS S3 (me-south-1) + CloudFront | Photos, documents, contracts |
| Auth | OTP SMS + JWT (access/refresh) | Saudi market standard |
| Monorepo | Turborepo + pnpm workspaces | Shared code, parallel builds |
| CI/CD | GitHub Actions | Auto deploy |
| Hosting | AWS me-south-1 (ECS Fargate) + Vercel | Data in Saudi Arabia (PDPL) |

---

## 2. Monorepo Structure

```
karfani/
├── apps/
│   ├── web/                    # Customer Next.js app
│   │   ├── app/[locale]/
│   │   │   ├── page.tsx                # Home / hero
│   │   │   ├── caravans/page.tsx       # Browse/search
│   │   │   ├── caravans/[id]/page.tsx  # Detail + booking
│   │   │   ├── booking/[id]/page.tsx   # Summary + payment
│   │   │   ├── routes/page.tsx         # Trip routes
│   │   │   ├── account/               # Profile, bookings, support
│   │   │   └── auth/                  # Login, verify OTP
│   │   ├── components/
│   │   ├── lib/
│   │   └── messages/ar.json, en.json
│   │
│   ├── admin/                  # Ops dashboard Next.js
│   │   └── app/
│   │       ├── dashboard/
│   │       ├── bookings/
│   │       ├── caravans/
│   │       ├── owners/
│   │       ├── inspections/
│   │       ├── maintenance/
│   │       ├── support/
│   │       ├── finance/
│   │       └── analytics/
│   │
│   └── mobile/                 # React Native (Expo)
│       └── app/
│           ├── (customer)/(tabs)/  # explore, bookings, routes, profile
│           └── (owner)/(tabs)/     # fleet, bookings, earnings, profile
│
├── packages/
│   ├── api/                    # NestJS backend
│   │   └── src/modules/
│   │       ├── auth/           # OTP, JWT, RBAC
│   │       ├── identity/       # National ID, driving license
│   │       ├── inventory/      # Caravan CRUD, media
│   │       ├── availability/   # Calendar slots
│   │       ├── pricing/        # Rules engine
│   │       ├── booking/        # State machine, policies
│   │       ├── payments/       # Moyasar integration
│   │       ├── contracts/      # PDF generation, e-sign
│   │       ├── inspection/     # Checklists, photos
│   │       ├── damage/         # Reports, disputes
│   │       ├── maintenance/    # Jobs, scheduling
│   │       ├── dispatch/       # Delivery/pickup
│   │       ├── support/        # Tickets, chat
│   │       ├── content/        # Routes, destinations
│   │       ├── analytics/      # KPIs
│   │       ├── admin/          # Control panel
│   │       └── notifications/  # SMS, WhatsApp, push, email
│   │
│   ├── database/               # Prisma schema + migrations
│   │   └── prisma/schema.prisma
│   │
│   └── shared/                 # Shared TypeScript
│       └── src/
│           ├── types/
│           ├── schemas/        # Zod validation
│           ├── constants/      # Roles, statuses, regions
│           └── utils/          # Date (Hijri), currency (SAR), phone (+966)
│
├── docker/
│   ├── Dockerfile.api
│   └── docker-compose.yml      # PG, Redis, MinIO
│
├── docs/
├── turbo.json
├── pnpm-workspace.yaml
└── .env.example
```

---

## 3. Database Schema (27+ Entity)

### Auth & Users
- `users` — phone, national_id, role[], locale, verified
- `driving_licenses` — license images, verification status, expiry
- `owner_profiles` — company details, IBAN, commission_rate

### Inventory
- `caravans` — type, make, model, year, plate, amenities JSON, sleeps, delivery_enabled, PostGIS location
- `caravan_media` — photos, videos, 360, order
- `caravan_documents` — registration, insurance, permits, expiry tracking

### Locations & Content
- `locations` — cities, hubs, campsites, pickup points + coordinates
- `routes` — waypoints JSON, difficulty, duration, seasonal
- `campsites` — facilities, capacity, permit requirements

### Availability & Pricing
- `availability_slots` — per-caravan per-day, block reasons
- `pricing_rules` — typed: BASE, WEEKEND, SEASONAL, EVENT, LONG_STAY with priority

### Bookings
- `bookings` — 12-state machine: PENDING_PAYMENT → CONFIRMED → PREPARING → DISPATCHED → HANDED_OVER → ACTIVE → RETURN_PENDING → RETURNED → POST_INSPECTION → COMPLETED (+ CANCELLED, DISPUTED)
- `booking_addons` — camping gear, BBQ, generator, etc.

### Payments
- `payments` — typed: booking_payment, security_deposit, damage_charge, refund; Moyasar refs
- `payouts` — owner payouts with period, commission, net, IBAN

### Operations
- `contracts` — template, content JSON, PDF URL, signatures
- `inspections` — typed: pre/post trip; odometer, fuel, scores, checklist JSON
- `inspection_photos` — categorized (exterior, interior, etc.)
- `damage_reports` — severity, cost, deduction, status flow
- `maintenance_jobs` — type, priority, parts, vendor, cost
- `support_tickets` — numbered, categorized, priority, assignment
- `ticket_messages` — sender role tracking

### Reviews & Compliance
- `reviews` — rating 1-5, photos, owner reply
- `promo_codes` — percentage/fixed, limits, date range
- `permits` — transport/tourism regulatory docs with expiry alerts
- `compliance_flags` — warnings/critical with resolution
- `notifications` — multi-channel with send/fail tracking

### Key Indexes
- `(caravanId, date, isAvailable)` — fast availability
- `(caravanId, startDate, endDate)` — booking conflicts
- PostGIS spatial indexes — location queries

---

## 4. Architecture Decisions

### Modular Monolith (not microservices)
17 NestJS modules in one deployable. Small team = no microservices overhead. Module boundaries enforce separation. Extract later if needed.

### Event-Driven Side Effects
`@nestjs/event-emitter` for domain events:
- `BookingConfirmedEvent` → SMS + WhatsApp + contract + notify owner
- `InspectionCompletedEvent` → update booking + notify customer
- `PaymentReceivedEvent` → confirm booking + receipt

Bull queues for async: PDF generation, image resizing, notification dispatch.

### Booking State Machine
12 states with explicit transition validation. Core business logic.

### Pricing Engine
Priority rules: event > seasonal > weekend > base. Long-stay discounts: 7+ days 7%, 14+ 12%, 30+ 20%. Saudi weekend = Friday-Saturday.

### RTL/i18n
- `next-intl` for web, `i18next` for mobile
- DB columns: `titleAr` (required) + `titleEn` (optional)
- Tailwind `rtl:` variant
- Font: IBM Plex Sans Arabic
- Arabic default

### BFF Pattern
Next.js API routes: cookie auth on web, token on mobile. BFF translates cookies → bearer tokens for NestJS.

---

## 5. Saudi Compliance

| المجال | المتطلب |
|--------|---------|
| PDPL | consent at registration, data in Saudi (me-south-1), encrypt PII (AES-256), right to access/delete |
| Transport (هيئة النقل) | caravan registration verification, commercial rental permits, e-contracts |
| Tourism (وزارة السياحة) | operator license, campsite classification standards |
| VAT (ZATCA) | 15% VAT per booking, e-invoicing (FATOORA) in Phase 4 |
| Payments | PCI DSS via Moyasar (tokenized, zero card data stored) |

---

## 6. Phased Execution

### Phase 1: MVP — Managed Marketplace (Weeks 1-10)

**Weeks 1-2: Foundation**
- [ ] Initialize Turborepo monorepo + pnpm
- [ ] Prisma schema + initial migration + seed
- [ ] NestJS scaffold + auth module (OTP via Unifonic)
- [ ] Docker Compose (PG, Redis, MinIO)
- [ ] GitHub Actions CI

**Weeks 3-4: Core Backend**
- [ ] Inventory module (caravan CRUD, S3 presigned upload)
- [ ] Availability module (calendar slots)
- [ ] Pricing module (base + weekend rules)
- [ ] Booking module (create, cancel, state machine)
- [ ] Payments module (Moyasar: mada, Apple Pay, STC Pay)

**Weeks 5-6: Customer Web**
- [ ] Next.js + next-intl (Arabic-first, RTL)
- [ ] Home page with city/date search
- [ ] Caravan browse with filters
- [ ] Caravan detail (gallery, specs, calendar, pricing)
- [ ] Booking flow (dates → add-ons → payment)
- [ ] Customer account pages

**Weeks 7-8: Operations**
- [ ] Contract PDF generation (Handlebars templates)
- [ ] Inspection module (checklist, photo upload)
- [ ] Basic admin dashboard
- [ ] Notifications (SMS confirmation, WhatsApp reminder)
- [ ] Support ticket system

**Weeks 9-10: Polish & Launch**
- [ ] Mobile app customer flow
- [ ] E2E testing
- [ ] CDN optimization
- [ ] PDPL consent flows
- [ ] Deploy to AWS me-south-1
- [ ] Beta with 3-5 caravans

### Phase 2: Experience Platform (Weeks 11-16)
Routes, destinations, campsite directory, trip planning, add-on marketplace, reviews, seasonal pricing, promo codes.

### Phase 3: Fleet & Operator OS (Weeks 17-24)
Full owner dashboard, owner mobile app, maintenance, damage/claims, dispatch, automated payouts, analytics.

### Phase 4: Scale & B2B (Weeks 25-32)
One-way rentals, hub network, B2B fleet tools, dynamic pricing, loyalty, insurance, FATOORA.

---

## 7. Critical Files (Implementation Order)

1. `packages/database/prisma/schema.prisma` — Data model (everything derives from this)
2. `packages/api/src/modules/auth/auth.service.ts` — OTP + JWT + RBAC
3. `packages/api/src/modules/inventory/inventory.service.ts` — Caravan CRUD
4. `packages/api/src/modules/availability/availability.service.ts` — Calendar
5. `packages/api/src/modules/pricing/pricing.service.ts` — Pricing engine
6. `packages/api/src/modules/booking/booking.service.ts` — Booking state machine (core)
7. `packages/api/src/modules/payments/moyasar.provider.ts` — Payment gateway
8. `apps/web/app/[locale]/caravans/[id]/page.tsx` — Main customer page
9. `apps/admin/app/dashboard/page.tsx` — Ops dashboard

---

## 8. Revenue Model

| مصدر الدخل | الوصف |
|------------|-------|
| عمولة حجز | نسبة من كل حجز |
| رسوم خدمة | على المستأجر |
| توصيل وتجهيز | delivery to campsite |
| تنظيف واسترجاع | cleanup fee |
| حماية/coverage | شراكة حماية أو رسوم |
| إضافات | مولد، ثلاجة، شواء، كراسي، GPS، Wi-Fi |
| باقات تجارب | hiking, camp setup, guided routes |
| SaaS اشتراك | للملاك الكبار وشركات التشغيل |
| صيانة وتخزين | للكرفانات |

---

## 9. Verification Plan

### Testing Strategy
- **Unit tests:** Jest for all NestJS services (booking state machine, pricing engine)
- **Integration tests:** Prisma + test database for booking flow
- **E2E tests:** Playwright for web flows (search → book → pay)
- **Mobile:** Detox for critical flows

### Manual Verification
1. Create a caravan listing with photos via admin
2. Search and find it on customer web
3. Complete booking flow with test Moyasar payment
4. Verify SMS/WhatsApp notifications received
5. Complete pre-trip inspection via admin
6. Complete post-trip inspection and verify damage flow
7. Verify owner payout calculation
8. Test Arabic/English switching and RTL layout
9. Test on mobile (iOS + Android)

### Deployment Verification
- Docker Compose local → staging (AWS) → production
- Health check endpoints for all services
- Monitoring: Sentry (errors) + CloudWatch (logs/metrics)
