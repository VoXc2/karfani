'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { Link } from '../../../i18n/navigation';
import { Compass } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'اتصل بنا',
      detail: '+966 9200 XXXXX',
      sub: 'من الأحد إلى الخميس، 9 ص - 6 م',
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      detail: 'support@karfani.com',
      sub: 'نرد خلال 24 ساعة',
    },
    {
      icon: MapPin,
      title: 'الموقع',
      detail: 'الرياض، المملكة العربية السعودية',
      sub: 'طريق الملك فهد',
    },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-16">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">كرفاني</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">تواصل معنا</h1>
          <p className="text-white/60 text-lg">نسعد بتواصلك ونرد عليك بأسرع وقت</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 text-center border border-cream-dark hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <card.icon className="w-6 h-6 text-olive" />
              </div>
              <h3 className="font-bold text-charcoal mb-1">{card.title}</h3>
              <p className="text-olive font-semibold text-sm mb-1">{card.detail}</p>
              <p className="text-charcoal-light text-xs">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-olive" />
              <h2 className="text-2xl font-bold text-charcoal">أرسل لنا رسالة</h2>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-olive" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">تم إرسال رسالتك بنجاح!</h3>
                <p className="text-charcoal-light">سنتواصل معك في أقرب وقت ممكن.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="أدخل اسمك"
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">رقم الجوال</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+966 5XXXXXXXX"
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">الموضوع</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all bg-white"
                    >
                      <option value="">اختر الموضوع</option>
                      <option value="general">استفسار عام</option>
                      <option value="booking">حجوزات</option>
                      <option value="support">دعم فني</option>
                      <option value="partnership">شراكات</option>
                      <option value="complaint">شكوى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-olive/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
