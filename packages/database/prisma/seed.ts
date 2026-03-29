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

  // Create caravans - comprehensive fleet across Saudi Arabia
  const caravanData = [
    {
      titleAr: 'كرفان عائلي فاخر - 6 أشخاص', titleEn: 'Luxury Family Caravan - 6 Persons',
      descriptionAr: 'كرفان عائلي مجهز بالكامل مع مطبخ وحمام وتكييف. مثالي لرحلات العائلة في الطبيعة.',
      descriptionEn: 'Fully equipped family caravan with kitchen, bathroom and AC.',
      type: CaravanType.MOTORHOME, make: 'Hymer', model: 'B-Class ML', year: 2023,
      plateNumber: 'أ ب ت 1234', sleeps: 6, length: 7.5,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: true, solar: false, tv: true, awning: true },
      deliveryEnabled: true, deliveryFee: 500, pickupLocationId: riyadhPickup.id,
      latitude: 24.7136, longitude: 46.6753, dailyRate: 1200, weekendRate: 1500,
      weeklyDiscount: 7, monthlyDiscount: 20, securityDeposit: 3000, minDays: 1, maxDays: 30,
    },
    {
      titleAr: 'كرفان مغامرات - شخصين', titleEn: 'Adventure Campervan - 2 Persons',
      descriptionAr: 'كرفان صغير ومريح للمغامرين. سهل القيادة ومجهز لرحلات الطرق الطويلة.',
      descriptionEn: 'Compact and comfortable campervan for adventurers.',
      type: CaravanType.CAMPERVAN, make: 'Volkswagen', model: 'California', year: 2024,
      plateNumber: 'د هـ و 5678', sleeps: 2, length: 5.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: false, wifi: false, generator: false, solar: true, tv: false, awning: true },
      deliveryEnabled: false, pickupLocationId: riyadhPickup.id,
      latitude: 24.7136, longitude: 46.6753, dailyRate: 700, weekendRate: 900,
      weeklyDiscount: 5, securityDeposit: 2000, minDays: 1, maxDays: 14,
    },
    {
      titleAr: 'كرفان VIP فاخر - 8 أشخاص', titleEn: 'VIP Luxury Caravan - 8 Persons',
      descriptionAr: 'أفخم كرفان في الأسطول. غرفة نوم رئيسية مع حمام خاص. غرفة معيشة واسعة مع تلفزيون 55 بوصة.',
      descriptionEn: 'The most luxurious caravan in the fleet. Master bedroom with ensuite bathroom.',
      type: CaravanType.MOTORHOME, make: 'Dethleffs', model: 'Grand Alpa', year: 2024,
      plateNumber: 'ر س ع 9012', sleeps: 8, length: 9.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: true, solar: true, tv: true, awning: true },
      deliveryEnabled: true, deliveryFee: 700, pickupLocationId: riyadhPickup.id,
      latitude: 24.6877, longitude: 46.7219, dailyRate: 2200, weekendRate: 2800,
      weeklyDiscount: 10, monthlyDiscount: 25, securityDeposit: 5000, minDays: 2, maxDays: 30,
    },
    {
      titleAr: 'فان جبلي مجهز', titleEn: 'Mountain-Ready Van',
      descriptionAr: 'فان مجهز خصيصاً لرحلات الجبال. دفع رباعي، تدفئة ممتازة، ومطبخ صغير.',
      descriptionEn: 'Van specially equipped for mountain trips. 4WD, excellent heating, compact kitchen.',
      type: CaravanType.CAMPERVAN, make: 'Mercedes', model: 'Sprinter 4x4', year: 2023,
      plateNumber: 'ك ل م 3456', sleeps: 3, length: 6.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: false, wifi: true, generator: false, solar: true, tv: false, awning: true },
      deliveryEnabled: true, deliveryFee: 400, pickupLocationId: jeddahHub.id,
      latitude: 21.4858, longitude: 39.1925, dailyRate: 950, weekendRate: 1200,
      weeklyDiscount: 8, securityDeposit: 2500, minDays: 1, maxDays: 21,
    },
    {
      titleAr: 'مقطورة شاطئية - 4 أشخاص', titleEn: 'Beach Trailer - 4 Persons',
      descriptionAr: 'مقطورة مصممة لعشاق البحر. خفيفة وسهلة السحب مع جميع التجهيزات اللازمة.',
      descriptionEn: 'Trailer designed for beach lovers. Lightweight, easy to tow with all amenities.',
      type: CaravanType.TRAILER, make: 'Airstream', model: 'Basecamp', year: 2023,
      plateNumber: 'ن ص ف 7890', sleeps: 4, length: 5.5,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: false, generator: false, solar: false, tv: false, awning: true },
      deliveryEnabled: false, pickupLocationId: jeddahHub.id,
      latitude: 21.5169, longitude: 39.2192, dailyRate: 600, weekendRate: 800,
      weeklyDiscount: 5, securityDeposit: 1500, minDays: 1, maxDays: 14,
    },
    {
      titleAr: 'كرفان صحراوي مجهز', titleEn: 'Desert-Ready Caravan',
      descriptionAr: 'كرفان مخصص لرحلات الصحراء. عزل حراري ممتاز، خزان مياه كبير، ألواح شمسية.',
      descriptionEn: 'Caravan specialized for desert trips. Excellent insulation, large water tank, solar panels.',
      type: CaravanType.MOTORHOME, make: 'Hobby', model: 'Optima De Luxe', year: 2024,
      plateNumber: 'ع ق د 2468', sleeps: 5, length: 7.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: true, solar: true, tv: true, awning: true },
      deliveryEnabled: true, deliveryFee: 600, pickupLocationId: riyadhPickup.id,
      latitude: 26.3266, longitude: 43.9750, dailyRate: 1100, weekendRate: 1400,
      weeklyDiscount: 7, securityDeposit: 3000, minDays: 2, maxDays: 21,
    },
    {
      titleAr: 'كرفان قابل للطي - اقتصادي', titleEn: 'Pop-Up Camper - Budget Friendly',
      descriptionAr: 'كرفان قابل للطي مثالي للمبتدئين. سعر اقتصادي مع كل الأساسيات.',
      descriptionEn: 'Pop-up camper ideal for beginners. Budget-friendly with all the basics.',
      type: CaravanType.POPUP, make: 'Jayco', model: 'Jay Sport', year: 2023,
      plateNumber: 'ب ج ح 1357', sleeps: 4, length: 4.0,
      amenities: { water: true, power: true, ac: false, kitchen: true, bathroom: false, wifi: false, generator: false, solar: false, tv: false, awning: true },
      deliveryEnabled: true, deliveryFee: 300, pickupLocationId: riyadhPickup.id,
      latitude: 24.7500, longitude: 46.7000, dailyRate: 350, weekendRate: 450,
      weeklyDiscount: 10, securityDeposit: 1000, minDays: 1, maxDays: 14,
    },
    {
      titleAr: 'مقطورة العلا السياحية', titleEn: 'AlUla Tourist Trailer',
      descriptionAr: 'مقطورة سياحية متمركزة قرب العلا. مثالية لاستكشاف مدائن صالح والمواقع الأثرية.',
      descriptionEn: 'Tourist trailer stationed near AlUla. Perfect for exploring Madain Saleh.',
      type: CaravanType.TRAILER, make: 'Knaus', model: 'Sport', year: 2024,
      plateNumber: 'ط ظ ذ 8642', sleeps: 3, length: 5.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: false, solar: true, tv: false, awning: true },
      deliveryEnabled: false, pickupLocationId: riyadhPickup.id,
      latitude: 26.6174, longitude: 37.9200, dailyRate: 800, weekendRate: 1000,
      weeklyDiscount: 8, securityDeposit: 2000, minDays: 2, maxDays: 14,
    },
    {
      titleAr: 'كرفان تبوك الشتوي', titleEn: 'Tabuk Winter Caravan',
      descriptionAr: 'كرفان مجهز للشتاء في تبوك ونيوم. تدفئة مركزية وعزل ممتاز لليالي الباردة.',
      descriptionEn: 'Winter-equipped caravan for Tabuk and NEOM. Central heating for cold nights.',
      type: CaravanType.MOTORHOME, make: 'Adria', model: 'Matrix Supreme', year: 2024,
      plateNumber: 'ش ض غ 9753', sleeps: 4, length: 6.5,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: true, solar: false, tv: true, awning: true },
      deliveryEnabled: true, deliveryFee: 800, pickupLocationId: riyadhPickup.id,
      latitude: 28.3998, longitude: 36.5717, dailyRate: 1000, weekendRate: 1300,
      weeklyDiscount: 7, securityDeposit: 2500, minDays: 2, maxDays: 21,
    },
    {
      titleAr: 'العجلة الخامسة - العائلة الكبيرة', titleEn: 'Fifth Wheel - Large Family',
      descriptionAr: 'أكبر وحدة في الأسطول. مثالي للعائلات الكبيرة مع غرفتين نوم وصالة واسعة.',
      descriptionEn: 'Largest unit in the fleet. Ideal for large families with 2 bedrooms and spacious living.',
      type: CaravanType.FIFTH_WHEEL, make: 'Grand Design', model: 'Solitude', year: 2024,
      plateNumber: 'ف ق ي 4680', sleeps: 10, length: 11.0,
      amenities: { water: true, power: true, ac: true, kitchen: true, bathroom: true, wifi: true, generator: true, solar: true, tv: true, awning: true },
      deliveryEnabled: true, deliveryFee: 1000, pickupLocationId: riyadhPickup.id,
      latitude: 24.7300, longitude: 46.6900, dailyRate: 2500, weekendRate: 3200,
      weeklyDiscount: 12, monthlyDiscount: 30, securityDeposit: 7000, minDays: 3, maxDays: 30,
    },
  ];

  const caravans = [];
  for (const data of caravanData) {
    const caravan = await prisma.caravan.create({
      data: { ...data, ownerId: ownerUser.ownerProfile!.id, status: CaravanStatus.ACTIVE },
    });
    caravans.push(caravan);
  }

  const [caravan1, caravan2] = caravans;

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

  // Create additional locations
  const additionalLocations = [
    { type: LocationType.PICKUP_POINT, nameAr: 'نقطة استلام العلا', nameEn: 'AlUla Pickup', city: 'العلا', region: 'منطقة المدينة المنورة', latitude: 26.6174, longitude: 37.9200 },
    { type: LocationType.PICKUP_POINT, nameAr: 'نقطة استلام تبوك', nameEn: 'Tabuk Pickup', city: 'تبوك', region: 'منطقة تبوك', latitude: 28.3998, longitude: 36.5717 },
    { type: LocationType.CAMPSITE, nameAr: 'مخيم الحِجر', nameEn: 'Al-Hijr Camp', city: 'العلا', region: 'منطقة المدينة المنورة', latitude: 26.7867, longitude: 37.9533, facilities: { water: true, electricity: true, bathrooms: true, bbqArea: true, parking: true }, capacity: 40 },
    { type: LocationType.CAMPSITE, nameAr: 'مخيم أملج الساحلي', nameEn: 'Umluj Beach Camp', city: 'أملج', region: 'منطقة تبوك', latitude: 25.0513, longitude: 37.2682, facilities: { water: true, electricity: false, bathrooms: true, bbqArea: true, parking: true }, capacity: 25 },
    { type: LocationType.HUB, nameAr: 'محطة الدمام', nameEn: 'Dammam Hub', city: 'الدمام', region: 'المنطقة الشرقية', latitude: 26.4207, longitude: 50.0888 },
    { type: LocationType.PICKUP_POINT, nameAr: 'نقطة استلام أبها', nameEn: 'Abha Pickup', city: 'أبها', region: 'منطقة عسير', latitude: 18.2164, longitude: 42.5053 },
    { type: LocationType.CAMPSITE, nameAr: 'مخيم حرة الحرة', nameEn: 'Harrat Al-Harrah Camp', city: 'حائل', region: 'منطقة حائل', latitude: 27.5114, longitude: 41.6844, facilities: { water: false, electricity: false, bathrooms: false, bbqArea: true, parking: true }, capacity: 15 },
  ];
  for (const loc of additionalLocations) {
    await prisma.location.create({ data: { ...loc, isActive: true, address: loc.nameAr } });
  }

  // Create reviews
  const reviewData = [
    { caravanId: caravans[0].id, userId: customer.id, rating: 5, commentAr: 'تجربة ممتازة! الكرفان نظيف ومجهز بكل شيء. التوصيل كان في الوقت المحدد.', commentEn: 'Excellent experience! Clean and fully equipped.' },
    { caravanId: caravans[0].id, userId: customer.id, rating: 5, commentAr: 'أفضل رحلة عائلية! الأطفال استمتعوا كثير والكرفان مريح جداً.', commentEn: 'Best family trip ever!' },
    { caravanId: caravans[0].id, userId: customer.id, rating: 4, commentAr: 'كرفان جميل ومرتب. التكييف ممتاز. أنصح به بشدة.', commentEn: 'Beautiful and clean caravan. AC is excellent.' },
    { caravanId: caravans[1].id, userId: customer.id, rating: 5, commentAr: 'فان ممتاز للمغامرات! سهل القيادة وعملي جداً.', commentEn: 'Excellent van for adventures!' },
    { caravanId: caravans[1].id, userId: customer.id, rating: 4, commentAr: 'رحلة رائعة في الصحراء. الفان كان مريح وعملي.', commentEn: 'Great desert trip. Van was comfortable.' },
    { caravanId: caravans[2].id, userId: customer.id, rating: 5, commentAr: 'كرفان VIP بكل معنى الكلمة. تجربة فخمة جداً.', commentEn: 'True VIP experience. Very luxurious.' },
    { caravanId: caravans[2].id, userId: customer.id, rating: 5, commentAr: 'من أفخم الكرفانات اللي جربتها. يستاهل كل ريال.', commentEn: 'One of the most luxurious caravans. Worth every riyal.' },
    { caravanId: caravans[3].id, userId: customer.id, rating: 4, commentAr: 'مثالي لرحلات الجبال. الدفع الرباعي كان ضروري.', commentEn: 'Perfect for mountain trips. 4WD was essential.' },
    { caravanId: caravans[4].id, userId: customer.id, rating: 5, commentAr: 'قضينا عطلة نهاية أسبوع رائعة على الشاطئ.', commentEn: 'Amazing beach weekend!' },
    { caravanId: caravans[5].id, userId: customer.id, rating: 4, commentAr: 'كرفان ممتاز للصحراء. العزل الحراري فعلاً ممتاز.', commentEn: 'Excellent desert caravan. Great insulation.' },
    { caravanId: caravans[6].id, userId: customer.id, rating: 5, commentAr: 'سعر ممتاز مقابل ما تحصل عليه. مثالي للمبتدئين.', commentEn: 'Great value. Perfect for beginners.' },
    { caravanId: caravans[7].id, userId: customer.id, rating: 5, commentAr: 'العلا كانت تجربة لا تنسى والمقطورة كانت مريحة جداً.', commentEn: 'AlUla was unforgettable, trailer was very comfortable.' },
    { caravanId: caravans[8].id, userId: customer.id, rating: 4, commentAr: 'التدفئة كانت ممتازة في ليالي تبوك الباردة.', commentEn: 'Heating was excellent on cold Tabuk nights.' },
    { caravanId: caravans[9].id, userId: customer.id, rating: 5, commentAr: 'حجم ضخم ومريح جداً. مثالي لعائلتنا الكبيرة.', commentEn: 'Huge and very comfortable. Perfect for our large family.' },
  ];
  for (const review of reviewData) {
    await prisma.review.create({ data: review });
  }

  // Create a second route
  await prisma.route.create({
    data: {
      titleAr: 'مسار جدة - أملج: رحلة الساحل',
      titleEn: 'Jeddah to Umluj: Coastal Journey',
      descriptionAr: 'رحلة ساحلية ممتعة من جدة إلى أملج عبر ينبع. شواطئ بيضاء ومياه فيروزية.',
      descriptionEn: 'Enjoyable coastal trip from Jeddah to Umluj via Yanbu. White beaches and turquoise waters.',
      difficulty: RouteDifficulty.EASY,
      distanceKm: 560,
      durationDays: 2,
      waypoints: [
        { lat: 21.4858, lng: 39.1925, nameAr: 'جدة', nameEn: 'Jeddah', description: 'نقطة الانطلاق', order: 0 },
        { lat: 24.0895, lng: 38.0618, nameAr: 'ينبع', nameEn: 'Yanbu', description: 'محطة استراحة - كورنيش ينبع', order: 1 },
        { lat: 25.0513, lng: 37.2682, nameAr: 'أملج', nameEn: 'Umluj', description: 'الوجهة - مالديف السعودية', order: 2 },
      ],
      seasonStart: 10,
      seasonEnd: 5,
      isActive: true,
    },
  });

  // Create a third route
  await prisma.route.create({
    data: {
      titleAr: 'مسار الرياض - العلا: رحلة التاريخ',
      titleEn: 'Riyadh to AlUla: History Journey',
      descriptionAr: 'رحلة تاريخية من الرياض إلى العلا عبر حائل. استكشف مدائن صالح والآثار النبطية.',
      descriptionEn: 'Historical journey from Riyadh to AlUla via Hail. Explore Madain Saleh and Nabataean ruins.',
      difficulty: RouteDifficulty.MODERATE,
      distanceKm: 1100,
      durationDays: 4,
      waypoints: [
        { lat: 24.7136, lng: 46.6753, nameAr: 'الرياض', nameEn: 'Riyadh', description: 'نقطة الانطلاق', order: 0 },
        { lat: 27.5114, lng: 41.6844, nameAr: 'حائل', nameEn: 'Hail', description: 'محطة أولى - جبل أجا', order: 1 },
        { lat: 26.6174, lng: 37.9200, nameAr: 'العلا', nameEn: 'AlUla', description: 'البلدة القديمة', order: 2 },
        { lat: 26.7867, lng: 37.9533, nameAr: 'مدائن صالح', nameEn: 'Madain Saleh', description: 'الوجهة النهائية - موقع اليونسكو', order: 3 },
      ],
      seasonStart: 10,
      seasonEnd: 4,
      isActive: true,
    },
  });

  console.log('✅ Seed completed!');
  console.log(`   Users: 3 (admin, customer, owner)`);
  console.log(`   Locations: ${3 + additionalLocations.length}`);
  console.log(`   Caravans: ${caravans.length}`);
  console.log(`   Reviews: ${reviewData.length}`);
  console.log(`   Routes: 3`);
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
