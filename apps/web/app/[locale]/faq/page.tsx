'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, CalendarCheck, CreditCard, XCircle, Truck, Info } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

type Category = 'booking' | 'payment' | 'cancellation' | 'owners' | 'general';

interface FAQ {
  question: string;
  answer: string;
  category: Category;
}

const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: 'booking', label: 'حجز', icon: <CalendarCheck className="w-4 h-4" /> },
  { key: 'payment', label: 'دفع', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'cancellation', label: 'إلغاء', icon: <XCircle className="w-4 h-4" /> },
  { key: 'owners', label: 'ملاك الكرفانات', icon: <Truck className="w-4 h-4" /> },
  { key: 'general', label: 'عام', icon: <Info className="w-4 h-4" /> },
];

const faqs: FAQ[] = [
  {
    category: 'booking',
    question: 'كيف أحجز كرفان عبر منصة كرفاني؟',
    answer: 'يمكنك حجز كرفان بسهولة من خلال تصفح الكرفانات المتاحة، اختيار التواريخ المناسبة، وتأكيد الحجز بالدفع الإلكتروني. ستتلقى تأكيداً فورياً عبر البريد الإلكتروني والرسائل النصية.',
  },
  {
    category: 'booking',
    question: 'ما هي المدة الأدنى والأقصى للحجز؟',
    answer: 'الحد الأدنى للحجز هو ليلة واحدة، والحد الأقصى يعتمد على مالك الكرفان وقد يصل إلى 30 يوماً. بعض الكرفانات قد تتطلب حداً أدنى أعلى خلال المواسم.',
  },
  {
    category: 'booking',
    question: 'هل يمكنني تعديل تواريخ الحجز بعد التأكيد؟',
    answer: 'نعم، يمكنك تعديل تواريخ الحجز قبل 48 ساعة من موعد الاستلام، بشرط توفر الكرفان في التواريخ الجديدة. قد يتم تعديل السعر وفقاً للتواريخ الجديدة.',
  },
  {
    category: 'payment',
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نقبل الدفع عبر بطاقات مدى، Apple Pay، فيزا، وماستركارد. جميع المعاملات مشفرة وآمنة بالكامل.',
  },
  {
    category: 'payment',
    question: 'هل يتم خصم المبلغ فوراً عند الحجز؟',
    answer: 'نعم، يتم خصم مبلغ الحجز بالكامل عند تأكيد الحجز. في حالة الإلغاء، يتم استرداد المبلغ وفقاً لسياسة الإلغاء المعتمدة.',
  },
  {
    category: 'payment',
    question: 'ما هو مبلغ التأمين (الضمان)؟',
    answer: 'يتم تجميد مبلغ تأمين يتراوح بين 500 إلى 2000 ريال حسب نوع الكرفان. يتم إرجاع المبلغ خلال 7 أيام عمل بعد إرجاع الكرفان بحالة سليمة.',
  },
  {
    category: 'payment',
    question: 'هل تشمل الأسعار ضريبة القيمة المضافة؟',
    answer: 'الأسعار المعروضة لا تشمل ضريبة القيمة المضافة (15%). يتم إضافة الضريبة عند صفحة الدفع مع توضيح كامل لتفاصيل السعر.',
  },
  {
    category: 'cancellation',
    question: 'ما هي سياسة الإلغاء؟',
    answer: 'الإلغاء قبل 7 أيام من موعد الاستلام: استرداد كامل. قبل 3-7 أيام: استرداد 75%. قبل 24-72 ساعة: استرداد 50%. أقل من 24 ساعة: لا يتم الاسترداد.',
  },
  {
    category: 'cancellation',
    question: 'كم يستغرق استرداد المبلغ بعد الإلغاء؟',
    answer: 'يتم معالجة الاسترداد خلال 3-5 أيام عمل. قد يستغرق ظهور المبلغ في حسابك البنكي حتى 14 يوم عمل حسب البنك.',
  },
  {
    category: 'cancellation',
    question: 'ماذا يحدث إذا ألغى المالك الحجز؟',
    answer: 'في حالة إلغاء المالك للحجز، يتم استرداد المبلغ بالكامل فوراً. كما نساعدك في إيجاد كرفان بديل مناسب بأفضل الأسعار.',
  },
  {
    category: 'owners',
    question: 'كيف أسجل كرفاني في المنصة؟',
    answer: 'يمكنك التسجيل كمالك من خلال إنشاء حساب مالك، إضافة تفاصيل الكرفان مع الصور، وتحديد الأسعار والتوفر. يتم مراجعة الطلب خلال 24-48 ساعة.',
  },
  {
    category: 'owners',
    question: 'ما هي نسبة العمولة التي تأخذها المنصة؟',
    answer: 'نسبة العمولة هي 15% من قيمة كل حجز. تشمل هذه النسبة خدمات التسويق، الدعم الفني، ومعالجة المدفوعات.',
  },
  {
    category: 'owners',
    question: 'هل يوجد تأمين يغطي الكرفان أثناء التأجير؟',
    answer: 'نعم، توفر كرفاني تغطية تأمينية شاملة تحمي الكرفان من الأضرار والحوادث أثناء فترة التأجير. يتم خصم تكلفة التأمين تلقائياً.',
  },
  {
    category: 'general',
    question: 'ما هو الحد الأدنى للعمر لاستئجار كرفان؟',
    answer: 'يجب أن يكون عمر المستأجر 21 سنة على الأقل مع رخصة قيادة سارية المفعول. بعض أنواع الكرفانات الكبيرة قد تتطلب عمر 25 سنة.',
  },
  {
    category: 'general',
    question: 'ما هي سياسة الوقود؟',
    answer: 'يتم تسليم الكرفان بخزان وقود ممتلئ ويجب إعادته بنفس المستوى. في حالة إعادته بوقود أقل، يتم خصم تكلفة الوقود من مبلغ التأمين.',
  },
  {
    category: 'general',
    question: 'ما هي آلية استلام وتسليم الكرفان؟',
    answer: 'يمكنك استلام الكرفان من موقع المالك أو طلب التوصيل (بتكلفة إضافية). عند الاستلام، يتم فحص الكرفان مع المالك وتوثيق حالته بالصور.',
  },
  {
    category: 'general',
    question: 'ماذا يشمل إيجار الكرفان؟',
    answer: 'يشمل الإيجار استخدام الكرفان بكامل تجهيزاته الأساسية (فراش، أدوات مطبخ، كهرباء). الإضافات مثل الكراسي الخارجية والشواية قد تكون بتكلفة إضافية حسب المالك.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('booking');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQs = faqs.filter((faq) => faq.category === activeCategory);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-olive via-olive-dark to-charcoal py-24 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-10 start-10 w-72 h-72 bg-sand/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 end-10 w-96 h-96 bg-copper/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">الأسئلة الشائعة</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            إجابات على أكثر الأسئلة شيوعاً حول استخدام منصة كرفاني
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setExpandedIndex(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                    activeCategory === cat.key
                      ? 'bg-gradient-to-r from-olive to-olive-dark text-white shadow-lg shadow-olive/25'
                      : 'bg-white text-charcoal-light border border-cream-dark hover:border-olive/30 hover:text-olive'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-start"
                  >
                    <h3 className="text-base font-bold text-charcoal flex-1">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-charcoal-light shrink-0 transition-transform duration-300 ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-charcoal-light leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
