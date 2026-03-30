'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Truck,
  Wifi,
  Flame,
  Wind,
  Droplets,
  Refrigerator,
  Tv,
  ShowerHead,
  Bed,
  UtensilsCrossed,
  Sun,
  MapPin,
  Send,
} from 'lucide-react';
import { Link } from '../../../../../i18n/navigation';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';

const STEPS = [
  { id: 1, title: 'المعلومات الأساسية' },
  { id: 2, title: 'المرافق' },
  { id: 3, title: 'التسعير' },
  { id: 4, title: 'الموقع' },
  { id: 5, title: 'مراجعة وإرسال' },
];

const CARAVAN_TYPES = [
  'كرفان فاخر',
  'كرفان متوسط',
  'كرفان عائلي',
  'كرفان مغامرة',
  'كرفان صغير',
  'بيت متنقل',
];

const AMENITIES = [
  { id: 'wifi', label: 'واي فاي', icon: Wifi },
  { id: 'ac', label: 'تكييف', icon: Wind },
  { id: 'kitchen', label: 'مطبخ', icon: UtensilsCrossed },
  { id: 'shower', label: 'دش', icon: ShowerHead },
  { id: 'toilet', label: 'حمام', icon: Droplets },
  { id: 'fridge', label: 'ثلاجة', icon: Refrigerator },
  { id: 'tv', label: 'تلفزيون', icon: Tv },
  { id: 'heater', label: 'تدفئة', icon: Flame },
  { id: 'beds', label: 'أسرّة مريحة', icon: Bed },
  { id: 'solar', label: 'طاقة شمسية', icon: Sun },
  { id: 'grill', label: 'شواية', icon: Flame },
  { id: 'awning', label: 'مظلة خارجية', icon: Sun },
];

interface FormData {
  title: string;
  type: string;
  description: string;
  make: string;
  model: string;
  year: string;
  sleeps: string;
  amenities: string[];
  priceDaily: string;
  priceWeekend: string;
  weeklyDiscount: string;
  deposit: string;
  pickupPoint: string;
  city: string;
  deliveryAvailable: boolean;
  deliveryFee: string;
}

export default function AddCaravanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormData>({
    title: '',
    type: '',
    description: '',
    make: '',
    model: '',
    year: '',
    sleeps: '',
    amenities: [],
    priceDaily: '',
    priceWeekend: '',
    weeklyDiscount: '',
    deposit: '',
    pickupPoint: '',
    city: '',
    deliveryAvailable: false,
    deliveryFee: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const toggleAmenity = (id: string) => {
    setForm({
      ...form,
      amenities: form.amenities.includes(id)
        ? form.amenities.filter((a) => a !== id)
        : [...form.amenities, id],
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.title.trim()) newErrors.title = 'اسم الكرفان مطلوب';
      if (!form.type) newErrors.type = 'نوع الكرفان مطلوب';
      if (!form.description.trim()) newErrors.description = 'الوصف مطلوب';
      if (!form.sleeps) newErrors.sleeps = 'عدد الأشخاص مطلوب';
    } else if (step === 3) {
      if (!form.priceDaily) newErrors.priceDaily = 'السعر اليومي مطلوب';
      if (!form.deposit) newErrors.deposit = 'مبلغ التأمين مطلوب';
    } else if (step === 4) {
      if (!form.city.trim()) newErrors.city = 'المدينة مطلوبة';
      if (!form.pickupPoint.trim()) newErrors.pickupPoint = 'نقطة الاستلام مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = () => {
    // In production, call useCreateCaravan mutation here
    alert('تم إرسال الكرفان للمراجعة!');
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all bg-white';
  const labelClasses = 'block text-sm font-semibold text-charcoal mb-2';
  const errorClasses = 'text-red-500 text-xs mt-1';

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Link
            href="/owner/caravans"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة لكرفاناتي
          </Link>
          <h1 className="text-3xl font-bold text-white">إضافة كرفان جديد</h1>
          <p className="text-white/60 mt-2">أضف كرفانك للتأجير عبر كرفاني</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Stepper */}
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : currentStep === step.id
                          ? 'bg-olive text-white shadow-lg shadow-olive/25'
                          : 'bg-cream-dark text-charcoal-light'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 hidden sm:block ${
                        currentStep === step.id
                          ? 'text-olive font-semibold'
                          : 'text-charcoal-light'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mt-[-1rem] sm:mt-0 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-cream-dark'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-charcoal mb-6">المعلومات الأساسية</h2>

                <div>
                  <label className={labelClasses}>اسم الكرفان *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="مثال: كرفان الصحراء الذهبي"
                    className={inputClasses}
                  />
                  {errors.title && <p className={errorClasses}>{errors.title}</p>}
                </div>

                <div>
                  <label className={labelClasses}>نوع الكرفان *</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="">اختر نوع الكرفان</option>
                    {CARAVAN_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className={errorClasses}>{errors.type}</p>}
                </div>

                <div>
                  <label className={labelClasses}>الوصف *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="صف كرفانك بالتفصيل..."
                    className={`${inputClasses} resize-none`}
                  />
                  {errors.description && (
                    <p className={errorClasses}>{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClasses}>الشركة المصنعة</label>
                    <input
                      type="text"
                      name="make"
                      value={form.make}
                      onChange={handleChange}
                      placeholder="مثال: Airstream"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>الموديل</label>
                    <input
                      type="text"
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      placeholder="مثال: Basecamp 20"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>سنة الصنع</label>
                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      placeholder="2024"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>عدد الأشخاص (النوم) *</label>
                  <input
                    type="number"
                    name="sleeps"
                    value={form.sleeps}
                    onChange={handleChange}
                    min="1"
                    max="12"
                    placeholder="6"
                    className={inputClasses}
                  />
                  {errors.sleeps && <p className={errorClasses}>{errors.sleeps}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Amenities */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-2">المرافق والتجهيزات</h2>
                <p className="text-charcoal-light text-sm mb-8">
                  اختر المرافق المتوفرة في كرفانك
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AMENITIES.map((amenity) => {
                    const Icon = amenity.icon;
                    const selected = form.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          selected
                            ? 'border-olive bg-olive/5 text-olive'
                            : 'border-cream-dark bg-white text-charcoal-light hover:border-olive/30'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{amenity.label}</span>
                        {selected && (
                          <Check className="w-4 h-4 text-olive" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-charcoal mb-6">التسعير</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>السعر اليومي (ر.س) *</label>
                    <input
                      type="number"
                      name="priceDaily"
                      value={form.priceDaily}
                      onChange={handleChange}
                      placeholder="950"
                      className={inputClasses}
                    />
                    {errors.priceDaily && (
                      <p className={errorClasses}>{errors.priceDaily}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>سعر نهاية الأسبوع (ر.س)</label>
                    <input
                      type="number"
                      name="priceWeekend"
                      value={form.priceWeekend}
                      onChange={handleChange}
                      placeholder="1200"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>خصم أسبوعي (%)</label>
                    <input
                      type="number"
                      name="weeklyDiscount"
                      value={form.weeklyDiscount}
                      onChange={handleChange}
                      placeholder="10"
                      min="0"
                      max="50"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>مبلغ التأمين (ر.س) *</label>
                    <input
                      type="number"
                      name="deposit"
                      value={form.deposit}
                      onChange={handleChange}
                      placeholder="2000"
                      className={inputClasses}
                    />
                    {errors.deposit && (
                      <p className={errorClasses}>{errors.deposit}</p>
                    )}
                  </div>
                </div>

                <div className="bg-cream rounded-2xl p-4">
                  <p className="text-sm text-charcoal-light">
                    <strong className="text-charcoal">ملاحظة:</strong> يتم خصم عمولة المنصة
                    (15%) من كل حجز. المبالغ المعروضة هي ما يدفعه المستأجر.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-charcoal mb-6">الموقع والاستلام</h2>

                <div>
                  <label className={labelClasses}>المدينة *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="مثال: الرياض"
                    className={inputClasses}
                  />
                  {errors.city && <p className={errorClasses}>{errors.city}</p>}
                </div>

                <div>
                  <label className={labelClasses}>نقطة الاستلام *</label>
                  <input
                    type="text"
                    name="pickupPoint"
                    value={form.pickupPoint}
                    onChange={handleChange}
                    placeholder="مثال: حي العليا، شارع العروبة"
                    className={inputClasses}
                  />
                  {errors.pickupPoint && (
                    <p className={errorClasses}>{errors.pickupPoint}</p>
                  )}
                </div>

                <div className="border-t border-cream-dark pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="deliveryAvailable"
                      checked={form.deliveryAvailable}
                      onChange={(e) =>
                        setForm({ ...form, deliveryAvailable: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-cream-dark text-olive focus:ring-olive"
                    />
                    <label htmlFor="deliveryAvailable" className="text-sm font-semibold text-charcoal">
                      متاح للتوصيل
                    </label>
                  </div>

                  {form.deliveryAvailable && (
                    <div>
                      <label className={labelClasses}>رسوم التوصيل (ر.س)</label>
                      <input
                        type="number"
                        name="deliveryFee"
                        value={form.deliveryFee}
                        onChange={handleChange}
                        placeholder="200"
                        className={inputClasses}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-6">مراجعة وإرسال</h2>

                <div className="space-y-4">
                  <div className="bg-cream rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-charcoal-light mb-3">
                      المعلومات الأساسية
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-charcoal-light">الاسم:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.title || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">النوع:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.type || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">الشركة:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.make || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">الموديل:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.model || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">السنة:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.year || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">ينام:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.sleeps || '-'} أشخاص
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cream rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-charcoal-light mb-3">المرافق</h3>
                    <div className="flex flex-wrap gap-2">
                      {form.amenities.length > 0 ? (
                        form.amenities.map((id) => {
                          const amenity = AMENITIES.find((a) => a.id === id);
                          return (
                            <span
                              key={id}
                              className="px-3 py-1 bg-olive/10 text-olive text-xs font-semibold rounded-full"
                            >
                              {amenity?.label}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-sm text-charcoal-light">لم يتم اختيار مرافق</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-cream rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-charcoal-light mb-3">التسعير</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-charcoal-light">يومي:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.priceDaily || '-'} ر.س
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">نهاية الأسبوع:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.priceWeekend || '-'} ر.س
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">خصم أسبوعي:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.weeklyDiscount || '0'}%
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">تأمين:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.deposit || '-'} ر.س
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cream rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-charcoal-light mb-3">الموقع</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-charcoal-light">المدينة:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.city || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">الاستلام:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.pickupPoint || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-light">توصيل:</span>
                        <span className="font-semibold text-charcoal ms-2">
                          {form.deliveryAvailable ? `نعم (${form.deliveryFee || 0} ر.س)` : 'لا'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-dark">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-cream transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  السابق
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
                >
                  التالي
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
                >
                  <Send className="w-4 h-4" />
                  إرسال للمراجعة
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
