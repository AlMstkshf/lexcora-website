import React, { useMemo, useState } from 'react';
import { Language, ArticleRecord } from '../types';
import { CONTENT } from '../constants';
import { Search, Clock, Calendar, ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import { getArticles } from '../services/articleService';

interface InsightsPageProps {
  lang: Language;
  onArticleClick?: (slug: string) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ lang, onArticleClick }) => {
  const t = CONTENT[lang].insightsPage;
  const [activeCategory, setActiveCategory] = useState(t.categories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const articles = useMemo<ArticleRecord[]>(() => getArticles(lang), [lang]);

  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const filteredArticles = articles.filter((article: ArticleRecord) => {
    const matchesCategory = activeCategory === t.categories[0] || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-lexcora-gold font-bold tracking-widest text-sm uppercase mb-2 block">
            {lang === 'en' ? 'Intelligence Hub' : 'مركز المعرفة'}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-lexcora-blue mb-6">
            {t.pageTitle}
          </h1>
          <p className="text-xl text-slate-600">
            {t.pageSubtitle}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:border-lexcora-gold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" size={18} />
            </div>
            <div className="flex flex-wrap gap-2">
              {t.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat 
                      ? 'bg-lexcora-blue text-white' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center text-slate-500">
            <FileText size={40} className="mb-3 text-slate-300" />
            {lang === 'en' ? 'No articles match your filters.' : 'لا توجد مقالات مطابقة للبحث.'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article 
                key={article.slug} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => onArticleClick?.(article.slug)}>
                   <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <span className="absolute top-4 left-4 z-20 bg-lexcora-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {article.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-lexcora-blue mb-3 group-hover:text-lexcora-gold transition-colors cursor-pointer" onClick={() => onArticleClick?.(article.slug)}>
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-500">{lang === 'en' ? 'By' : 'بقلم'} <span className="text-lexcora-blue">{article.author}</span></div>
                    <button onClick={() => onArticleClick?.(article.slug)} className="text-sm font-bold text-lexcora-gold hover:text-yellow-500 flex items-center gap-1 transition-colors">
                      {t.readMore} <Arrow size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
