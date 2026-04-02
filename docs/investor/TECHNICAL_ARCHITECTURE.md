# Karfani - Technical Architecture Document
# كرفاني - وثيقة البنية التقنية

---

## 1. نظرة عامة على البنية

كرفاني مبنية على بنية **Monorepo** حديثة وقابلة للتوسع، مع فصل واضح بين الواجهة الأمامية والخلفية وقاعدة البيانات.

```
karfani/
├── apps/
│   ├── web/          # تطبيق المستخدم (Next.js 15 + React 19)
│   └── admin/        # لوحة الإدارة (Next.js 15)
├── packages/
│   ├── api/          # Backend API (NestJS 11)
│   ├── database/     # Prisma Schema + Migrations
│   └── shared/       # أكواد مشتركة (Types, Utils, Validators)
├── docker-compose.yml
└── turbo.json        # Turborepo config
```

---

## 2. التقنيات المستخدمة (Tech Stack)

### Frontend:
| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| Next.js | 15.5 | إطار عمل React مع SSR/SSG |
| React | 19 | واجهة المستخدم |
| TypeScript | 5.7+ | Type safety |
| Tailwind CSS | v4 | تصميم |
| TanStack Query | v5 | إدارة حالة الـ API |
| Framer Motion | 12+ | رسوم متحركة |
| next-intl | latest | تعدد اللغات (AR/EN) |
| Mapbox GL JS | latest | خرائط تفاعلية |

### Backend:
| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| NestJS | 11 | إطار عمل API |
| Prisma | 6.6 | ORM لقاعدة البيانات |
| PostgreSQL | 16 | قاعدة البيانات الرئيسية |
| Redis | 7 | Cache + Queue Broker |
| Bull | latest | معالجة خلفية (Background Jobs) |
| Socket.io | latest | اتصال فوري (WebSocket) |
| JWT | latest | مصادقة |
| Swagger | latest | توثيق API |

### Infrastructure:
| التقنية | الغرض |
|---------|-------|
| Docker | حاويات |
| Docker Compose | تنسيق الخدمات |
| Turborepo | إدارة Monorepo |
| pnpm | مدير الحزم |
| MinIO | تخزين الملفات (S3-compatible) |
| Vitest | اختبارات آلية |

---

## 3. بنية قاعدة البيانات

### 20+ جدول يغطي كل جوانب العمل:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    Users     │────>│ OwnerProfile │────>│   Caravans  │
│  (العملاء)   │     │ (ملف المالك)  │     │ (الكرفانات)  │
└──────┬──────┘     └──────────────┘     └──────┬──────┘
       │                                        │
       │           ┌──────────────┐             │
       └──────────>│   Bookings   │<────────────┘
                   │  (الحجوزات)   │
                   └──────┬──────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────┴──────┐  ┌───────┴──────┐  ┌──────┴───────┐
│   Payments   │  │  Contracts   │  │ Inspections  │
│   (الدفع)    │  │  (العقود)    │  │   (الفحص)    │
└──────────────┘  └──────────────┘  └──────────────┘
```

### النماذج الرئيسية:
- **User** - المستخدمين (CUSTOMER, OWNER, OPS_ADMIN, SUPER_ADMIN)
- **OwnerProfile** - ملف المالك (IBAN, الهوية، العنوان)
- **Caravan** - الكرفانات (النوع، السعة، المواصفات، السعر، الحالة)
- **CaravanMedia** - صور ووسائط الكرفان
- **Booking** - الحجوزات (10 حالات من PENDING إلى COMPLETED)
- **Payment** - المدفوعات (بوابة Moyasar)
- **Contract** - العقود الإلكترونية
- **Review** - التقييمات
- **Inspection** - الفحوصات (قبل/بعد)
- **DamageReport** - تقارير الأضرار
- **MaintenanceJob** - الصيانة
- **SupportTicket** - تذاكر الدعم
- **Location** - المواقع والوجهات
- **Route** - المسارات السياحية
- **Addon** - الإضافات (معدات، طباخ، مرشد)

---

## 4. وحدات الـ API (17 وحدة)

| الوحدة | الوظيفة | Endpoints |
|--------|---------|-----------|
| **Auth** | مصادقة بـ OTP + JWT | 4 |
| **Inventory** | إدارة الكرفانات | 7 |
| **Booking** | نظام الحجز | 6 |
| **Payments** | الدفع عبر Moyasar | 3 |
| **Availability** | إدارة التوافر | 3 |
| **Pricing** | التسعير الديناميكي | 3 |
| **Content** | المحتوى والخريطة | 4 |
| **Upload** | رفع الملفات | 2 |
| **Notifications** | الإشعارات | 2 |
| **Contracts** | العقود الإلكترونية | 4 |
| **Inspection** | الفحوصات | 4 |
| **Damage** | تقارير الأضرار | 5 |
| **Maintenance** | الصيانة | 6 |
| **Dispatch** | التوصيل والاستلام | 6 |
| **Support** | تذاكر الدعم | 4 |
| **Analytics** | التحليلات | 5 |
| **Admin** | إدارة النظام | 7 |
| **المجموع** | | **~75 endpoint** |

---

## 5. دورة حياة الحجز (Booking Lifecycle)

```
PENDING_PAYMENT → CONFIRMED → PREPARING → DISPATCHED →
HANDED_OVER → ACTIVE → RETURN_PENDING → RETURNED →
POST_INSPECTION → COMPLETED

                    ↓ (في أي مرحلة مبكرة)
                 CANCELLED

                    ↓ (بعد الفحص)
                 DISPUTED
```

كل انتقال يصدر أحداث (Events) تُعالج بواسطة:
- **WebSocket** - إشعارات فورية للمالك والمستأجر
- **Bull Queue** - إرسال SMS/Email/Push
- **Event Emitter** - تحديث البيانات

---

## 6. الأمان والحماية

| الإجراء | التفاصيل |
|---------|---------|
| **JWT Authentication** | Access token (15 دقيقة) + Refresh token (7 أيام) |
| **Role-based Access** | CUSTOMER, OWNER, OPS_ADMIN, SUPER_ADMIN |
| **Rate Limiting** | 100 طلب/15 دقيقة عام، 10 طلبات/15 دقيقة للمصادقة |
| **CORS** | تقييد الأصول المسموحة |
| **Helmet** | رؤوس أمان HTTP |
| **Input Validation** | class-validator على كل DTO |
| **SQL Injection** | Prisma parameterized queries |
| **XSS** | React auto-escaping + CSP headers |
| **PDPL Compliance** | موافقة ملفات الارتباط، إشعار الخصوصية |
| **Route Protection** | Middleware يحمي /user/* و /owner/* |

---

## 7. الأداء والتوسع

### الحالي:
- **Redis Cache**: كاش ذكي على الكرفانات (5 دقائق)، المحتوى (10 دقائق)، التحليلات (15 دقيقة)
- **Bull Queues**: معالجة الصور والإشعارات بشكل غير متزامن
- **SSR + SSG**: صفحات ثابتة مسبقة الإنشاء للأداء
- **Code Splitting**: تحميل كسول للمكونات

### خطة التوسع:
- **Phase 1** (MVP): Single server, Docker Compose
- **Phase 2** (1K+ users): Kubernetes, Load Balancer
- **Phase 3** (10K+ users): Microservices, CDN, Read Replicas
- **Phase 4** (100K+ users): Multi-region, Event-driven Architecture

---

## 8. الاختبارات والجودة

| النوع | العدد | التغطية |
|------|-------|---------|
| Unit Tests (API) | 58 | الخدمات الأساسية |
| Unit Tests (Shared) | 92 | المساعدات والمخططات |
| **المجموع** | **150** | **الوظائف الحرجة** |

### أدوات الجودة:
- **Vitest**: إطار الاختبارات
- **TypeScript Strict Mode**: تحقق الأنواع
- **ESLint + Prettier**: توحيد الكود
- **Pre-commit Hooks**: فحص قبل الالتزام

---

## 9. مخطط النشر (Deployment)

```yaml
# docker-compose.yml
services:
  api:          # NestJS Backend (Port 4000)
  web:          # Next.js Frontend (Port 3000)
  admin:        # Admin Panel (Port 3001)
  postgres:     # PostgreSQL Database (Port 5432)
  redis:        # Redis Cache + Queue (Port 6379)
  minio:        # File Storage (Port 9000)
```

### بيئات النشر:
- **Development**: Docker Compose محلي
- **Staging**: Cloud VM (DigitalOcean/AWS)
- **Production**: Kubernetes (AWS EKS / GCP GKE)

---

## 10. خارطة طريق تقنية

### Q1 2025 - الإطلاق:
- [x] MVP مكتمل
- [ ] نشر على السحابة (AWS/GCP)
- [ ] تكامل Moyasar الحقيقي
- [ ] تكامل Unifonic للرسائل

### Q2 2025 - التطبيق:
- [ ] React Native App (iOS + Android)
- [ ] Push Notifications
- [ ] Real-time Chat بين المالك والمستأجر
- [ ] نظام الإحالة

### Q3 2025 - التحسين:
- [ ] AI Recommendations (اقتراحات ذكية)
- [ ] Dynamic Pricing (تسعير ذكي بناءً على الطلب)
- [ ] Image AI (فحص تلقائي بالذكاء الاصطناعي)
- [ ] Analytics Dashboard متقدم

### Q4 2025 - التوسع:
- [ ] Multi-region deployment
- [ ] Microservices migration
- [ ] API Gateway (Kong/AWS API Gateway)
- [ ] CDN + Edge Computing
