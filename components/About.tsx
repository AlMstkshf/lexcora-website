import React from 'react';
import { Language } from '../types';
import { PageHelmet } from './PageHelmet';

interface AboutProps {
  lang: Language;
}

export const About: React.FC<AboutProps> = ({ lang }) => {
  const isEnglish = lang === 'en';

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <PageHelmet
        title={isEnglish ? 'About Lexcora | UAE Legal ERP' : 'حول ليكسورا | منصة القضايا القانونية'}
        description={
          isEnglish
            ? 'Learn about Lexcora, the UAE-first legal ERP helping firms streamline casework, governance, and client experience.'
            : 'تعرّف على ليكسورا، منصة تخطيط الموارد القانونية المصممة لدولة الإمارات لتبسيط القضايا والحوكمة وتجربة العملاء.'
        }
      />
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lexcora-gold/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-lexcora-blue/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexcora-blue/5 border border-lexcora-blue/10 text-lexcora-blue text-xs font-semibold tracking-widest uppercase">
              {isEnglish ? 'Who We Are' : 'من نحن'}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-lexcora-blue leading-tight">
              {isEnglish ? 'Built for UAE Legal Teams' : 'مصممة لفرق القانون في الإمارات'}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              {isEnglish
                ? 'Lexcora is a UAE-first legal ERP that unifies casework, compliance, finance, and client experience in a single secure platform. We partner with regional courts, regulators, and leading firms to deliver workflow automation, predictive insights, and governance you can trust.'
                : 'ليكسورا هي منصة تخطيط موارد قانونية مُصممة لدولة الإمارات توحد إدارة القضايا والامتثال والمالية وتجربة العملاء في منصة آمنة واحدة. نتعاون مع المحاكم والجهات التنظيمية والشركات الرائدة في المنطقة لتقديم أتمتة للعمليات ورؤى تنبؤية وحوكمة موثوقة.'}
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: isEnglish ? 'UAE compliance-native' : 'متوافقة مع الإمارات',
                  body: isEnglish
                    ? 'Pre-mapped to UAE judiciary processes, data residency, and Arabic-first interfaces.'
                    : 'منظومة متكاملة مع إجراءات القضاء الإماراتي وإقامة البيانات وواجهات عربية أولاً.',
                },
                {
                  title: isEnglish ? 'Secure by design' : 'أمن مُصمم بعناية',
                  body: isEnglish
                    ? 'Bank-grade encryption, granular permissions, and continuous audit trails for every action.'
                    : 'تشفير بمستوى المصارف وصلاحيات دقيقة وسجلات تدقيق مستمرة لكل إجراء.',
                },
                {
                  title: isEnglish ? 'Adoption without friction' : 'اعتماد بلا تعقيد',
                  body: isEnglish
                    ? 'Guided onboarding, bilingual support, and in-product training tailored to legal teams.'
                    : 'إعداد موجه ودعم ثنائي اللغة وتدريب داخل المنتج مخصص لفرق القانون.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-lexcora-blue mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="bg-lexcora-blue text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div>
                <p className="text-sm text-lexcora-gold font-semibold tracking-widest uppercase mb-2">
                  {isEnglish ? 'Our mission' : 'مهمتنا'}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                  {isEnglish
                    ? 'Give every firm a secure, intelligent operating system'
                    : 'تزويد كل مكتب قانوني بنظام تشغيل آمن وذكي'}
                </h2>
                <p className="text-slate-200 max-w-2xl">
                  {isEnglish
                    ? 'We believe legal teams deserve tooling that matches the pace of UAE innovation—without sacrificing compliance.'
                    : 'نؤمن بأن الفرق القانونية تستحق أدوات تواكب سرعة الابتكار في الإمارات دون التفريط بالامتثال.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {['SOC 2 Readiness', 'Arabic-first UX', 'Court Integrations', 'Data Residency'].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
