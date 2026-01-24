import React, { useEffect, useState } from 'react';
import { Language, ArticleRecord } from '../types';
import { CONTENT } from '../constants';
import { Button } from './Button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getFeaturedArticles } from '../services/articleService';

interface InsightsProps {
  lang: Language;
  onViewAll: () => void;
  onArticleClick?: (slug: string) => void;
}

export const Insights: React.FC<InsightsProps> = ({ lang, onViewAll, onArticleClick }) => {
  const t = CONTENT[lang].insights;
  const [articles, setArticles] = useState<ArticleRecord[]>([]);

  useEffect(() => {
    let isMounted = true;
    const featured = getFeaturedArticles(lang);
    if (isMounted) setArticles(featured);
    return () => {
      isMounted = false;
    };
  }, [lang]);

  const handleArticleClick = (slug: string) => {
    if (onArticleClick) {
      onArticleClick(slug);
    } else {
      onViewAll();
    }
  };

  return (
    <section id="insights" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold text-lexcora-blue mb-4">{t.title}</h2>
            <p className="text-lg text-slate-600">{t.subtitle}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onViewAll}
            aria-label={lang === 'en' ? 'View All Insights' : 'عرض جميع الرؤى'}
          >
            {lang === 'en' ? 'View All Insights' : 'عرض جميع الرؤى'}
          </Button>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-sm">
            {lang === 'en' ? 'New insights are being prepared. Check back soon.' : 'جارٍ إعداد محتوى جديد، عد لاحقاً.'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article 
                key={article.slug} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group border border-slate-100 flex flex-col h-full"
              >
                <div 
                  className="h-48 overflow-hidden relative cursor-pointer" 
                  onClick={() => handleArticleClick(article.slug)}
                >
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 z-20 bg-lexcora-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {article.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-medium mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                  </div>
                  <h3 
                    className="font-serif text-xl font-bold text-lexcora-blue mb-3 leading-snug cursor-pointer hover:text-lexcora-gold transition-colors"
                    onClick={() => handleArticleClick(article.slug)}
                  >
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-700">{lang === 'en' ? 'By' : 'بقلم'} <span className="text-lexcora-blue">{article.author}</span></div>
                    <button 
                      onClick={() => handleArticleClick(article.slug)}
                      className="text-sm font-bold text-lexcora-blue hover:text-lexcora-gold flex items-center gap-1 transition-colors"
                      aria-label={`${lang === 'en' ? 'Read Article' : 'اقرأ المقال'} - ${article.title}`}
                    >
                      {lang === 'en' ? 'Read Article' : 'اقرأ المقال'} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
