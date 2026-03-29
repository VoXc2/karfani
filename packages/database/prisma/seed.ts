import { PrismaClient, UserRole, CaravanType, CaravanStatus, LocationType, RouteDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Karfani database...');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      phone: '+966500000001',
      fullNameAr: 'مدير النظام',
      fullNameEn: 'System Admin',
      roles: [UserRole.SUPER_ADMIN, UserRole.OPS_ADMIN],
      isVerified: true,
      locale: 'ar',
    },
  });

  // Create customer user
  const customer = await prisma.user.create({
    data: {
      phone: '+966500000002',
      fullNameAr: 'محمد العميل',
      fullNameEn: 'Mohammed Customer',
      roles: [UserRole.CUSTOMER],
      isVerified: true,
      locale: 'ar',
    },
  });

  // Create owner user + profile
  const ownerUser = await prisma.user.create({
    data: {
      phone: '+966500000003',
      fullNameAr: 'أحمد المالك',
      fullNameEn: 'Ahmed Owner',
      roles: [UserRole.OWNER],
      isVerified: true,
      locale: 'ar',
      ownerProfile: {
        create: {
          companyNameAr: 'مؤسسة كرفانات الرياض',
          companyNameEn: 'Riyadh Caravans Est.',
          iban: 'SA0380000000608010167519',
          commissionRate: 0.15,
          isVerified: true,
        },
      },
    },
    include: { ownerProfile: true },
  });

  // Create locations
  const riyadhPickup = await prisma.location.create({
    data: {
      type: LocationType.PICKUP_POINT,
      nameAr: 'نقطة استلام الرياض',
      nameEn: 'Riyadh Pickup Point',
      city: 'الرياض',
      region: 'منطقة الرياض',
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'طريق الملك فهد، الرياض',
      isActive: true,
    },
  });

  const aseerCampsite = await prisma.location.create({
    data: {
      type: LocationType.CAMPSITE,
      nameAr: 'مخيم السودة',
      nameEn: 'Al Soudah Camp',
      city: 'أبها',
      region: 'منطقة عسير',
      latitude: 18.2578,
      longitude: 42.3667,
      address: 'منتزه السودة، عسير',
      facilities: { water: true, electricity: true, bathrooms: true, bbqArea: true, parking: true },
      capacity: 50,
      isActive: true,
    },
  });

  const jeddahHub = await prisma.location.create({
    data: {
      type: LocationType.HUB,
      nameAr: 'محطة جدة',
      nameEn: 'Jeddah Hub',
      city: 'جدة',
      region: 'منطقة مكة المكرمة',
      latitude: 21.4858,
      longitude: 39.1925,
      address: 'طريق المدينة، جدة',
      isActive: true,
    },
  });

  // Create campsite linked to location
  const soudahCampsite = await prisma.campsite.create({
    data: {
      locationId: aseerCampsite.id,
      nameAr: 'مخيم السودة الطبيعي',
      nameEn: 'Al Soudah Nature Camp',
      descriptionAr: 'مخيم طبيعي في قمة السودة مع إطلالات خلابة على الجبال',
      facilities: { tents: true, firepit: true, water: true, electricity: true, bathrooms: true, wifi: false },
      capacity: 30,
      pricePerNight: 150,
      isActive: true,
    },
  });

  // Create caravans
  const caravan1 = await prisma.caravan.create({
    data: {
      ownerId: ownerUser.ownerProfile!.id,
      titleAr: 'كرفان عائلي فاخر - 6 أشخاص',
      titleEn: 'Luxury Family Caravan - 6 Persons',
      descriptionAr: 'كرفان عائلي مجهز بالكامل مع مطبخ وحمام وتكييف. مثالي لرحلات العائلة في الطبيعة.',
      descriptionEn: 'Fully equipped family caravan with kitchen, bathroom and AC. Perfect for family nature trips.',
      type: CaravanType.MOTORHOME,
      make: 'Hymer',
      model: 'B-Class ML',
      year: 2023,
      plateNumber: 'أ ب ت 1234',
      sleeps: 6,
      length: 7.5,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: true, solar: false, tv: true, awning: true },
      status: CaravanStatus.ACTIVE,
      deliveryEnabled: true,
      deliveryFee: 500,
      pickupLocationId: riyadhPickup.id,
      latitude: 24.7136,
      longitude: 46.6753,
      dailyRate: 1200,
      weekendRate: 1500,
      weeklyDiscount: 7,
      monthlyDiscount: 20,
      securityDeposit: 3000,
      minDays: 1,
      maxDays: 30,
    },
  });

  const caravan2 = await prisma.caravan.create({
    data: {
      ownerId: ownerUser.ownerProfile!.id,
      titleAr: 'كرفان مغامرات - شخصين',
      titleEn: 'Adventure Campervan - 2 Persons',
      descriptionAr: 'كرفان صغير ومريح للمغامرين. سهل القيادة ومجهز لرحلات الطرق الطويلة.',
      descriptionEn: 'Compact and comfortable campervan for adventurers. Easy to drive and equipped for long road trips.',
      type: CaravanType.CAMPERVAN,
      make: 'Volkswagen',
      model: 'California',
      year: 2024,
      plateNumber: 'د هـ و 5678',
      sleeps: 2,
      length: 5.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: false, wifi: false, generator: false, solar: true, tv: false, awning: true },
      status: CaravanStatus.ACTIVE,
      deliveryEnabled: false,
      pickupLocationId: riyadhPickup.id,
      latitude: 24.7136,
      longitude: 46.6753,
      dailyRate: 700,
      weekendRate: 900,
      weeklyDiscount: 5,
      securityDeposit: 2000,
      minDays: 1,
      maxDays: 14,
    },
  });

  // Create media for caravans
  await prisma.caravanMedia.createMany({
    data: [
      { caravanId: caravan1.id, url: '/seed/caravan1-exterior.jpg', type: 'PHOTO', caption: 'المنظر الخارجي', sortOrder: 0 },
      { caravanId: caravan1.id, url: '/seed/caravan1-interior.jpg', type: 'PHOTO', caption: 'المنظر الداخلي', sortOrder: 1 },
      { caravanId: caravan1.id, url: '/seed/caravan1-kitchen.jpg', type: 'PHOTO', caption: 'المطبخ', sortOrder: 2 },
      { caravanId: caravan2.id, url: '/seed/caravan2-exterior.jpg', type: 'PHOTO', caption: 'المنظر الخارجي', sortOrder: 0 },
      { caravanId: caravan2.id, url: '/seed/caravan2-interior.jpg', type: 'PHOTO', caption: 'المنظر الداخلي', sortOrder: 1 },
    ],
  });

  // Create route
  const route = await prisma.route.create({
    data: {
      titleAr: 'مسار الرياض - عسير: رحلة الجبال والغيوم',
      titleEn: 'Riyadh to Aseer: Mountains & Clouds Journey',
      descriptionAr: 'رحلة مذهلة من الرياض إلى قمم عسير عبر طرق جبلية خلابة. توقف في الباحة واستمتع بالطبيعة.',
      descriptionEn: 'An amazing journey from Riyadh to the peaks of Aseer through stunning mountain roads. Stop in Al Baha and enjoy nature.',
      difficulty: RouteDifficulty.MODERATE,
      distanceKm: 950,
      durationDays: 3,
      waypoints: [
        { lat: 24.7136, lng: 46.6753, nameAr: 'الرياض', nameEn: 'Riyadh', description: 'نقطة الانطلاق', order: 0 },
        { lat: 20.0, lng: 41.4686, nameAr: 'الباحة', nameEn: 'Al Baha', description: 'محطة استراحة - غابة رغدان', order: 1 },
        { lat: 18.2164, lng: 42.5053, nameAr: 'أبها', nameEn: 'Abha', description: 'وسط مدينة أبها', order: 2 },
        { lat: 18.2578, lng: 42.3667, nameAr: 'السودة', nameEn: 'Al Soudah', description: 'الوجهة النهائية - قمة السودة', order: 3 },
      ],
      seasonStart: 9,
      seasonEnd: 4,
      isActive: true,
    },
  });

  // Link campsite to route
  await prisma.campsiteOnRoute.create({
    data: {
      routeId: route.id,
      campsiteId: soudahCampsite.id,
      dayNumber: 3,
      notes: 'المبيت في مخيم السودة - الليلة الأخيرة',
    },
  });

  // Create availability slots for next 30 days
  const today = new Date();
  const slots = [];
  for (const caravan of [caravan1, caravan2]) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      slots.push({
        caravanId: caravan.id,
        date,
        isAvailable: true,
      });
    }
  }
  await prisma.availabilitySlot.createMany({ data: slots });

  // Create pricing rules
  await prisma.pricingRule.createMany({
    data: [
      { caravanId: caravan1.id, type: 'BASE', name: 'السعر الأساسي', dailyRate: 1200, priority: 0, daysOfWeek: [] },
      { caravanId: caravan1.id, type: 'WEEKEND', name: 'سعر نهاية الأسبوع', dailyRate: 1500, priority: 1, daysOfWeek: [5, 6] },
      { caravanId: caravan2.id, type: 'BASE', name: 'السعر الأساسي', dailyRate: 700, priority: 0, daysOfWeek: [] },
      { caravanId: caravan2.id, type: 'WEEKEND', name: 'سعر نهاية الأسبوع', dailyRate: 900, priority: 1, daysOfWeek: [5, 6] },
    ],
  });

  console.log('✅ Seed completed!');
  console.log(`   Users: 3 (admin, customer, owner)`);
  console.log(`   Locations: 3 (Riyadh, Aseer, Jeddah)`);
  console.log(`   Caravans: 2`);
  console.log(`   Routes: 1 (Riyadh → Aseer)`);
  console.log(`   Availability: ${slots.length} slots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
