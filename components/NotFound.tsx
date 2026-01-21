import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { PageHelmet } from './PageHelmet';

interface NotFoundProps {
  lang: Language;
}

export const NotFound: React.FC<NotFoundProps> = ({ lang }) => {
  const isEnglish = lang === 'en';
  const pathWithLang = (path: string) => `/${lang}${path === '/' ? '' : path}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-24">
      <PageHelmet
        title={isEnglish ? 'Page not found | Lexcora' : 'الصفحة غير موجودة | ليكسورا'}
        description={
          isEnglish
            ? 'The page you are looking for does not exist. Navigate back to Lexcora home or explore features.'
            : 'الصفحة التي تبحث عنها غير موجودة. يمكنك العودة إلى الرئيسية أو استكشاف المزايا.'
        }
        lang={lang}
      />
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 md:p-14 text-center max-w-xl">
        <div className="w-16 h-16 rounded-full bg-lexcora-gold/20 text-lexcora-blue font-bold text-2xl flex items-center justify-center mx-auto mb-6">
          404
        </div>
        <h1 className="text-3xl font-serif font-bold text-lexcora-blue mb-4">
          {isEnglish ? 'Page not found' : 'الصفحة غير موجودة'}
        </h1>
        <p className="text-slate-600 mb-8">
          {isEnglish
            ? 'We could not find the route you requested. Try visiting the homepage or our pricing plans.'
            : 'تعذر العثور على المسار المطلوب. يمكنك زيارة الصفحة الرئيسية أو خطط الأسعار.'}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to={pathWithLang('/')}
            className="px-5 py-3 rounded-lg border border-lexcora-blue text-lexcora-blue font-semibold hover:bg-lexcora-blue hover:text-white transition-colors"
          >
            {isEnglish ? 'Back to Home' : 'العودة للرئيسية'}
          </Link>
          <Link
            to={pathWithLang('/pricing')}
            className="px-5 py-3 rounded-lg bg-lexcora-gold text-lexcora-blue font-semibold hover:bg-yellow-400 transition-colors"
          >
            {isEnglish ? 'View Pricing' : 'عرض الأسعار'}
          </Link>
        </div>
      </div>
    </div>
  );
};
