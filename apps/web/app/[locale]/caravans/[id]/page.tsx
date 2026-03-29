'use client';

import { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import {
  Star, Users, MapPin, Heart, Share2, Shield, Check, Calendar,
  Wifi, Snowflake, Flame, Zap, ChefHat, Droplets, Tv, Car,
  ChevronLeft, ChevronRight, ArrowLeft, MessageCircle, Phone
} from 'lucide-react';
import { Link } from '../../../../i18n/navigation';

// Mock caravan data
const caravan = {
  id: 1,
  title: 'كرفان عائلي فاخر - موديل 2024',
  type: 'كرفان متنقل',
  location: 'الرياض',
  region: 'منطقة الرياض',
  sleeps: 6,
  price: 1200,
  weekendPrice: 1500,
  rating: 4.8,
  reviews: 124,
  images: ['🏕️', '🛏️', '🍳', '🚿', '🏜️'],
  owner: { name: 'عبدالله المهندس', avatar: '👨', joined: '2023', responseRate: '98%', responseTime: '< ساعة' },
  description: 'كرفان عائلي فاخر موديل 2024 مجهز بالكامل. يتسع حتى 6 أشخاص مع سريرين مزدوجين وسرير علوي. مطبخ كامل مع ثلاجة وميكرويف. حمام مع دش ماء ساخن. تكييف مركزي وتدفئة. واي فاي متنقل. شاشة عرض. طاقة شمسية.',
  amenities: [
    { icon: Wifi, name: 'واي فاي متنقل' },
    { icon: Snowflake, name: 'تكييف مركزي' },
    { icon: Flame, name: 'تدفئة' },
    { icon: Zap, name: 'طاقة شمسية' },
    { icon: ChefHat, name: 'مطبخ كامل' },
    { icon: Droplets, name: 'حمام مع دش' },
    { icon: Tv, name: 'شاشة عرض' },
    { icon: Car, name: 'توصيل متاح' },
  ],
  rules: ['ممنوع التدخين داخل الكرفان', 'يجب إعادة الكرفان نظيفاً', 'الحيوانات الأليفة غير مسموحة', 'يجب أن يكون عمر السائق 21+'],
  cancellation: 'إلغاء مجاني قبل 48 ساعة من موعد الرحلة. إلغاء قبل 24 ساعة يخصم 50%. لا استرداد بعد ذلك.',
};

const reviewsList = [
  { name: 'أحمد الشهري', avatar: '👨', rating: 5, date: 'منذ أسبوع', text: 'تجربة ممتازة! الكرفان نظيف ومجهز بكل شيء. التوصيل كان في الوقت المحدد.' },
  { name: 'نورة القحطاني', avatar: '👩', rating: 5, date: 'منذ أسبوعين', text: 'أفضل رحلة عائلية! الأطفال استمتعوا كثير والكرفان مريح جداً.' },
  { name: 'فهد العتيبي', avatar: '👨', rating: 4, date: 'منذ شهر', text: 'كرفان جميل ومرتب. التكييف ممتاز. أنصح به بشدة.' },
];

export default function CaravanDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(2);

  const nights = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (86400000))
    : 0;
  const subtotal = nights * caravan.price;
  const serviceFee = Math.round(subtotal * 0.1);
  const vat = Math.round((subtotal + serviceFee) * 0.15);
  const total = subtotal + serviceFee + vat;

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-charcoal-light mb-6">
            <Link href="/" className="hover:text-olive transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
            <Link href="/caravans" className="hover:text-olive transition-colors">الكرفانات</Link>
            <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
            <span className="text-charcoal font-medium">{caravan.title}</span>
          </nav>

          {/* Gallery */}
          <div className="relative mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-3xl overflow-hidden">
              {/* Main Image */}
              <div className="relative h-80 lg:h-[480px] bg-gradient-to-br from-sand-light to-olive/20 flex items-center justify-center">
                <span className="text-[140px] transition-transform duration-500">{caravan.images[activeImage]}</span>
                {/* Nav arrows */}
                <button
                  onClick={() => setActiveImage((p) => (p - 1 + caravan.images.length) % caravan.images.length)}
                  className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImage((p) => (p + 1) % caravan.images.length)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              {/* Grid */}
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {caravan.images.slice(1, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i + 1)}
                    className={`h-full bg-gradient-to-br from-cream to-sand-light/50 flex items-center justify-center hover:opacity-90 transition-opacity ${
                      activeImage === i + 1 ? 'ring-3 ring-olive' : ''
                    }`}
                  >
                    <span className="text-6xl">{img}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 end-4 flex items-center gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Share2 className="w-4 h-4 text-charcoal" />
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  liked ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-charcoal hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnails (mobile) */}
            <div className="flex lg:hidden items-center justify-center gap-2 mt-4">
              {caravan.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeImage ? 'bg-olive w-8' : 'bg-cream-dark'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-olive/10 text-olive text-sm font-medium rounded-full">{caravan.type}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-copper text-copper" />
                    <span className="font-semibold text-sm">{caravan.rating}</span>
                    <span className="text-charcoal-light text-sm">({caravan.reviews} تقييم)</span>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">{caravan.title}</h1>
                <div className="flex items-center gap-4 text-charcoal-light">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{caravan.location}، {caravan.region}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>ينام {caravan.sleeps} أشخاص</span>
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-cream-dark">
                <span className="text-4xl">{caravan.owner.avatar}</span>
                <div className="flex-1">
                  <p className="font-bold text-charcoal">{caravan.owner.name}</p>
                  <p className="text-sm text-charcoal-light">عضو منذ {caravan.owner.joined} • معدل الرد {caravan.owner.responseRate}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-olive text-olive rounded-xl hover:bg-olive hover:text-white transition-all text-sm font-medium">
                  <MessageCircle className="w-4 h-4" />
                  تواصل
                </button>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">عن الكرفان</h2>
                <p className="text-charcoal-light leading-relaxed">{caravan.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">المرافق والتجهيزات</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {caravan.amenities.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.name} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-cream-dark">
                        <Icon className="w-5 h-5 text-olive" />
                        <span className="text-sm font-medium text-charcoal">{a.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rules */}
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">قواعد الاستخدام</h2>
                <div className="space-y-2">
                  {caravan.rules.map((rule) => (
                    <div key={rule} className="flex items-center gap-3 text-charcoal-light">
                      <Check className="w-4 h-4 text-olive shrink-0" />
                      <span className="text-sm">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation */}
              <div className="p-5 bg-olive/5 rounded-2xl border border-olive/10">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-olive" />
                  <h2 className="text-lg font-bold text-charcoal">سياسة الإلغاء</h2>
                </div>
                <p className="text-charcoal-light text-sm leading-relaxed">{caravan.cancellation}</p>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-charcoal">التقييمات ({caravan.reviews})</h2>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-copper text-copper" />
                    <span className="text-lg font-bold">{caravan.rating}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviewsList.map((review) => (
                    <div key={review.name} className="p-5 bg-white rounded-2xl border border-cream-dark">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{review.avatar}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal text-sm">{review.name}</p>
                          <p className="text-xs text-charcoal-light">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-copper text-copper' : 'text-cream-dark'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-charcoal-light text-sm leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Card (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-cream-dark p-6 sticky top-24">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-olive">{caravan.price.toLocaleString()}</span>
                  <span className="text-charcoal-light">ر.س / ليلة</span>
                </div>

                {/* Date Inputs */}
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">تاريخ البداية</label>
                      <div className="relative">
                        <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">تاريخ النهاية</label>
                      <div className="relative">
                        <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">عدد الأشخاص</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-9 h-9 rounded-lg border border-cream-dark flex items-center justify-center hover:border-olive transition-colors text-lg"
                      >
                        −
                      </button>
                      <span className="font-semibold text-charcoal w-8 text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(caravan.sleeps, guests + 1))}
                        className="w-9 h-9 rounded-lg border border-cream-dark flex items-center justify-center hover:border-olive transition-colors text-lg"
                      >
                        +
                      </button>
                      <span className="text-xs text-charcoal-light">حد أقصى {caravan.sleeps}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="border-t border-cream-dark pt-4 mb-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-charcoal-light">
                      <span>{caravan.price.toLocaleString()} ر.س × {nights} ليالي</span>
                      <span>{subtotal.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-light">
                      <span>رسوم الخدمة</span>
                      <span>{serviceFee.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-light">
                      <span>ضريبة القيمة المضافة (15%)</span>
                      <span>{vat.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-charcoal pt-2 border-t border-cream-dark text-base">
                      <span>الإجمالي</span>
                      <span className="text-olive">{total.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button className="w-full py-3.5 bg-gradient-to-r from-copper to-copper-light text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-copper/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  {nights > 0 ? 'احجز الآن' : 'اختر التواريخ'}
                </button>

                {/* Trust */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-charcoal-light">
                  <Shield className="w-3.5 h-3.5 text-olive" />
                  <span>حماية كاملة • دفع آمن</span>
                </div>

                {/* Contact */}
                <div className="mt-4 pt-4 border-t border-cream-dark">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-olive text-olive rounded-xl text-sm font-medium hover:bg-olive hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                    تواصل مع المالك
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
