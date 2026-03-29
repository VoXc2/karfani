import { setRequestLocale } from 'next-intl/server';
import { Scale, FileText } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = [
    {
      title: 'مقدمة',
      content: [
        'مرحباً بك في كرفاني. باستخدامك لمنصتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.',
        'تنطبق هذه الشروط على جميع مستخدمي المنصة بما في ذلك المستأجرين ومالكي الكرفانات والزوار.',
      ],
    },
    {
      title: 'سياسة الحجز',
      content: [
        'يتم تأكيد الحجز بعد إتمام عملية الدفع بنجاح. يجب أن يكون المستأجر لا يقل عمره عن 21 عاماً ويمتلك رخصة قيادة سارية المفعول.',
        'يجب تقديم هوية وطنية أو إقامة سارية عند استلام الكرفان. يحق لمالك الكرفان رفض التسليم في حال عدم استيفاء الشروط.',
        'يتم احتساب مبلغ التأمين عند الحجز ويُسترد كاملاً بعد إعادة الكرفان بحالة جيدة خلال 7 أيام عمل.',
      ],
    },
    {
      title: 'سياسة الإلغاء والاسترداد',
      content: [
        'إلغاء مجاني: يمكنك الإلغاء واسترداد كامل المبلغ إذا تم الإلغاء قبل 72 ساعة من موعد الاستلام.',
        'إلغاء متأخر: في حال الإلغاء خلال 24-72 ساعة من موعد الاستلام، يتم خصم 25% من قيمة الحجز.',
        'عدم الحضور: في حال عدم الحضور لاستلام الكرفان دون إشعار مسبق، لا يتم استرداد أي مبلغ.',
        'يحق للمنصة إلغاء الحجز في حالات القوة القاهرة مع استرداد كامل المبلغ.',
      ],
    },
    {
      title: 'مسؤوليات المستأجر',
      content: [
        'يلتزم المستأجر بالمحافظة على الكرفان واستخدامه بشكل مسؤول وفقاً للتعليمات المقدمة.',
        'يُحظر التدخين داخل الكرفان ما لم يُذكر خلاف ذلك. أي ضرر ناتج عن سوء الاستخدام يتحمله المستأجر.',
        'يجب الالتزام بالسعة القصوى للركاب المحددة لكل كرفان وعدم تجاوزها.',
        'يلتزم المستأجر بإعادة الكرفان في الموعد المحدد. التأخير يُحتسب بأجرة يومية إضافية.',
      ],
    },
    {
      title: 'حدود المسؤولية',
      content: [
        'توفر كرفاني منصة للربط بين مالكي الكرفانات والمستأجرين، ولا تتحمل مسؤولية مباشرة عن حالة الكرفانات.',
        'لا تتحمل المنصة مسؤولية أي أضرار أو إصابات ناتجة عن استخدام الكرفان خارج نطاق الاستخدام المعتاد.',
        'تلتزم المنصة بتوفير تغطية تأمينية أساسية لجميع الحجوزات المتممة عبر المنصة.',
        'في جميع الأحوال، لا تتجاوز مسؤولية المنصة قيمة الحجز المعني.',
      ],
    },
    {
      title: 'الملكية الفكرية',
      content: [
        'جميع المحتويات والعلامات التجارية والتصاميم المعروضة على المنصة هي ملكية خاصة لكرفاني.',
        'يُحظر نسخ أو إعادة توزيع أي محتوى من المنصة دون إذن كتابي مسبق.',
      ],
    },
    {
      title: 'التعديلات على الشروط',
      content: [
        'تحتفظ كرفاني بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية.',
        'استمرارك في استخدام المنصة بعد التعديل يعني موافقتك على الشروط المحدثة.',
      ],
    },
    {
      title: 'القانون المطبق',
      content: [
        'تخضع هذه الشروط والأحكام لأنظمة المملكة العربية السعودية. أي نزاع ينشأ عن استخدام المنصة يخضع لاختصاص المحاكم السعودية المختصة.',
      ],
    },
  ];

  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Header */}
      <section className="relative bg-gradient-to-br from-olive via-olive-dark to-charcoal py-20 lg:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-10 start-10 w-72 h-72 bg-sand/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 end-10 w-96 h-96 bg-copper/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">الشروط والأحكام</h1>
          <p className="text-white/60 text-lg">آخر تحديث: مارس 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            {sections.map((section, index) => (
              <div key={section.title} className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-olive/10 rounded-lg flex items-center justify-center text-sm font-bold text-olive">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-bold text-charcoal">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-charcoal-light leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact Note */}
            <div className="bg-olive/5 rounded-2xl p-6 border border-olive/10 text-center">
              <FileText className="w-6 h-6 text-olive mx-auto mb-3" />
              <p className="text-charcoal-light">
                إذا كان لديك أي استفسار حول هذه الشروط والأحكام، يرجى التواصل معنا عبر صفحة{' '}
                <a href="/ar/contact" className="text-olive font-semibold hover:underline">تواصل معنا</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
