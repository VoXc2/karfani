import { setRequestLocale } from 'next-intl/server';
import { Compass, Shield, Heart, Mountain, Users, Target, Eye } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const values = [
    {
      icon: Shield,
      title: 'الثقة والأمان',
      description: 'نضمن لك تجربة آمنة وموثوقة مع فحص شامل لكل كرفان وتغطية تأمينية كاملة.',
    },
    {
      icon: Heart,
      title: 'شغف الاستكشاف',
      description: 'نؤمن بأن كل رحلة هي قصة جديدة، ونسعى لجعل كل تجربة لا تُنسى.',
    },
    {
      icon: Mountain,
      title: 'احترام الطبيعة',
      description: 'نلتزم بالسياحة المسؤولة والحفاظ على البيئة الطبيعية للمملكة.',
    },
    {
      icon: Users,
      title: 'مجتمع متعاون',
      description: 'نبني مجتمعاً من محبي السفر البري يتشاركون التجارب والنصائح.',
    },
  ];

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
            <Compass className="w-8 h-8 text-sand" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">عن كرفاني</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            منصة سعودية رائدة تُعيد تعريف تجربة السفر البري في المملكة العربية السعودية
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-copper" />
                  <h2 className="text-2xl font-bold text-charcoal">رسالتنا</h2>
                </div>
                <p className="text-charcoal-light leading-relaxed text-lg mb-6">
                  نسعى في كرفاني لتمكين كل شخص من استكشاف جمال المملكة العربية السعودية من خلال
                  تجربة سفر بري فريدة ومريحة وآمنة. نربط بين مالكي الكرفانات والمسافرين لخلق
                  تجارب لا تُنسى في أجمل الوجهات الطبيعية.
                </p>
                <p className="text-charcoal-light leading-relaxed">
                  من صحاري الربع الخالي إلى جبال عسير، ومن شواطئ البحر الأحمر إلى واحات الأحساء -
                  نفتح لك أبواب المغامرة في كل ركن من أركان المملكة.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-copper" />
                  <h2 className="text-2xl font-bold text-charcoal">رؤيتنا</h2>
                </div>
                <p className="text-charcoal-light leading-relaxed text-lg mb-6">
                  أن نكون المنصة الأولى للسياحة البرية في المنطقة، ونساهم في تحقيق رؤية 2030
                  بتطوير قطاع السياحة وتعزيز الهوية الوطنية من خلال استكشاف الوجهات المحلية.
                </p>
                <div className="bg-white rounded-2xl p-6 border border-cream-dark">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-olive">+500</div>
                      <div className="text-sm text-charcoal-light mt-1">كرفان</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-olive">13</div>
                      <div className="text-sm text-charcoal-light mt-1">منطقة</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-olive">+10K</div>
                      <div className="text-sm text-charcoal-light mt-1">رحلة</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-charcoal mb-3">قيمنا</h2>
            <p className="text-charcoal-light text-lg">المبادئ التي توجه كل ما نقوم به</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-cream rounded-2xl p-6 text-center hover:shadow-lg transition-shadow border border-cream-dark"
              >
                <div className="w-14 h-14 bg-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-olive" />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{value.title}</h3>
                <p className="text-charcoal-light text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-6">قصتنا</h2>
            <p className="text-charcoal-light text-lg leading-relaxed mb-6">
              بدأت فكرة كرفاني من شغف مجموعة من محبي السفر البري في المملكة العربية السعودية.
              لاحظنا أن هناك طلباً متزايداً على تجارب السفر البري، لكن لم تكن هناك منصة موثوقة
              تربط بين مالكي الكرفانات والباحثين عن مغامرات جديدة.
            </p>
            <p className="text-charcoal-light text-lg leading-relaxed mb-8">
              من هنا انطلقنا ببناء كرفاني - منصة تجمع بين التقنية والشغف لتقديم أفضل تجربة
              سفر بري في المملكة. نعمل يومياً على تطوير خدماتنا وتوسيع شبكتنا لنصل إلى كل
              محب للمغامرة في أرجاء المملكة.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-olive/10 rounded-2xl text-olive font-semibold">
              <Compass className="w-5 h-5" />
              انضم إلى مجتمع كرفاني اليوم
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
