import { setRequestLocale } from 'next-intl/server';
import { Shield, Lock, FileText } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = [
    {
      title: 'جمع البيانات',
      content: [
        'نقوم بجمع البيانات الشخصية التي تقدمها طوعاً عند إنشاء حساب أو إجراء حجز، مثل: الاسم الكامل، رقم الجوال، البريد الإلكتروني، ورقم الهوية الوطنية أو الإقامة.',
        'نجمع أيضاً بيانات الاستخدام تلقائياً مثل: عنوان IP، نوع المتصفح، صفحات الزيارة، ووقت التصفح، وذلك لتحسين تجربة المستخدم.',
        'قد نجمع بيانات الموقع الجغرافي بموافقتك لتقديم توصيات مخصصة للوجهات والكرفانات القريبة منك.',
      ],
    },
    {
      title: 'استخدام البيانات',
      content: [
        'نستخدم بياناتك لتوفير وتحسين خدماتنا، بما في ذلك: معالجة الحجوزات، التواصل معك بشأن حجوزاتك، وتقديم الدعم الفني.',
        'نستخدم بيانات الاستخدام لتحليل أنماط التصفح وتحسين أداء المنصة وتجربة المستخدم.',
        'قد نرسل لك إشعارات تسويقية حول العروض والوجهات الجديدة، ويمكنك إلغاء الاشتراك في أي وقت.',
        'نستخدم بياناتك للتحقق من هويتك ومنع الاحتيال وضمان أمان المنصة.',
      ],
    },
    {
      title: 'مشاركة البيانات',
      content: [
        'لا نبيع بياناتك الشخصية لأي طرف ثالث تحت أي ظرف.',
        'نشارك بياناتك الضرورية مع مالكي الكرفانات لإتمام عملية الحجز (مثل: اسمك ورقم جوالك).',
        'قد نشارك بياناتك مع مزودي خدمات الدفع المعتمدين لمعالجة المدفوعات بشكل آمن.',
        'قد نُفصح عن بياناتك إذا تطلب القانون ذلك أو بناءً على أمر قضائي من الجهات المختصة في المملكة العربية السعودية.',
      ],
    },
    {
      title: 'حماية البيانات',
      content: [
        'نستخدم تقنيات التشفير المتقدمة (SSL/TLS) لحماية بياناتك أثناء النقل.',
        'نخزن بياناتك في خوادم آمنة داخل المملكة العربية السعودية وفقاً لمتطلبات نظام حماية البيانات الشخصية (PDPL).',
        'نقوم بمراجعات أمنية دورية واختبارات اختراق لضمان سلامة أنظمتنا.',
        'نقيد الوصول إلى بياناتك الشخصية للموظفين المصرح لهم فقط وفق مبدأ الحاجة للمعرفة.',
      ],
    },
    {
      title: 'حقوقك',
      content: [
        'لديك الحق في الوصول إلى بياناتك الشخصية المخزنة لدينا وطلب نسخة منها.',
        'يمكنك طلب تصحيح أو تحديث بياناتك الشخصية في أي وقت عبر إعدادات حسابك.',
        'لديك الحق في طلب حذف بياناتك الشخصية، مع مراعاة الالتزامات القانونية التي قد تتطلب الاحتفاظ ببعض البيانات.',
        'يمكنك الاعتراض على معالجة بياناتك لأغراض التسويق المباشر في أي وقت.',
        'لديك الحق في تقديم شكوى للجهة المختصة إذا كنت تعتقد أن بياناتك لا تُعالج بشكل صحيح.',
      ],
    },
    {
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: [
        'نستخدم ملفات تعريف الارتباط الضرورية لتشغيل المنصة بشكل صحيح وتذكر تفضيلاتك.',
        'نستخدم ملفات تعريف الارتباط التحليلية لفهم كيفية استخدام المنصة وتحسينها.',
        'يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك، لكن تعطيل بعضها قد يؤثر على تجربة الاستخدام.',
      ],
    },
    {
      title: 'التعديلات على السياسة',
      content: [
        'نحتفظ بالحق في تحديث هذه السياسة من وقت لآخر. سنُعلمك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة.',
        'ننصحك بمراجعة هذه السياسة بشكل دوري للاطلاع على أي تحديثات.',
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
            <Shield className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">سياسة الخصوصية</h1>
          <p className="text-white/60 text-lg">آخر تحديث: مارس 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Intro */}
            <div className="bg-olive/5 rounded-2xl p-6 border border-olive/10 mb-10">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-olive" />
                <span className="font-bold text-charcoal">التزامنا بحماية خصوصيتك</span>
              </div>
              <p className="text-charcoal-light leading-relaxed">
                في كرفاني، نلتزم بحماية بياناتك الشخصية وفقاً لنظام حماية البيانات الشخصية (PDPL) في المملكة العربية السعودية.
                توضح هذه السياسة كيفية جمع واستخدام وحماية بياناتك.
              </p>
            </div>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <div key={section.title} className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-copper/10 rounded-lg flex items-center justify-center text-sm font-bold text-copper">
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
            </div>

            {/* Contact Note */}
            <div className="bg-olive/5 rounded-2xl p-6 border border-olive/10 text-center mt-10">
              <FileText className="w-6 h-6 text-olive mx-auto mb-3" />
              <p className="text-charcoal-light">
                إذا كان لديك أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة{' '}
                <a href="/ar/contact" className="text-olive font-semibold hover:underline">تواصل معنا</a>{' '}
                أو عبر البريد الإلكتروني: <span className="text-olive font-semibold">privacy@karfani.com</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
