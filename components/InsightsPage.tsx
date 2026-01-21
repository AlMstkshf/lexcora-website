import React, { useMemo, useState } from 'react';
import { Language, ArticleRecord } from '../types';
import { CONTENT } from '../constants';
import { Search, Clock, Calendar, ArrowRight, ArrowLeft, Sparkles, FileText, BrainCircuit, Loader2, Scale } from 'lucide-react';
import { Button } from './Button';
import { analyzeLegalText } from '../services/geminiService';
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
  
  // AI Lab State
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleAnalyze = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    try {
      const result = await analyzeLegalText(analysisInput, lang);
      setAnalysisResult(result);
    } catch (e) {
      setAnalysisResult("Analysis failed. Please try again.");
    }
    setIsAnalyzing(false);
  };

  const filteredArticles = articles.filter((article: ArticleRecord) => {
    const matchesCategory = activeCategory === t.categories[0] || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-lexcora-gold font-bold tracking-widest text-sm uppercase mb-2 block">
            {lang === 'en' ? 'Intelligence Hub' : 'مركز الذكاء'}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-lexcora-blue mb-6">
            {t.pageTitle}
          </h1>
          <p className="text-xl text-slate-600">
            {t.pageSubtitle}
          </p>
        </div>

        {/* AI Lab - New Feature */}
        <div className="mb-16 bg-lexcora-blue rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lexcora-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 border-r border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-lexcora-gold/20 flex items-center justify-center text-lexcora-gold">
                   <BrainCircuit size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">AI Document Intelligence</h2>
                  <p className="text-slate-400 text-sm">Analyze contracts or briefs using Gemini 3 Pro reasoning.</p>
                </div>
              </div>

              <textarea 
                className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm focus:outline-none focus:border-lexcora-gold transition-colors font-mono resize-none"
                placeholder={lang === 'en' ? "Paste legal text here for instant analysis..." : "الصق النص القانوني هنا للتحليل الفوري..."}
                value={analysisInput}
                onChange={(e) => setAnalysisInput(e.target.value)}
              />

              <div className="mt-6 flex justify-between items-center">
                <p className="text-[10px] text-slate-500 max-w-[200px]">
                  {lang === 'en' ? "Gemini 3 Pro handles high-reasoning legal tasks." : "جيمناي ٣ برو يعالج المهام القانونية المعقدة."}
                </p>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !analysisInput.trim()}
                  className="!px-8"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> {lang === 'en' ? 'Run Analysis' : 'تشغيل التحليل'}</>}
                </Button>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-white/5 backdrop-blur-sm min-h-[400px]">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-lexcora-gold/20 border-t-lexcora-gold rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lexcora-gold" size={20} />
                  </div>
                  <h3 className="text-white font-bold mb-2">Gemini is Processing</h3>
                  <p className="text-slate-400 text-sm">Cross-referencing UAE statutes and identifying risks...</p>
                </div>
              ) : analysisResult ? (
                <div className="h-full flex flex-col animate-fade-in">
                  <div className="flex items-center gap-2 mb-6 text-lexcora-gold font-bold uppercase text-xs tracking-widest">
                    <Scale size={14} /> Analysis Report
                  </div>
                  <div className="flex-1 text-slate-200 text-sm leading-relaxed overflow-y-auto max-h-[400px] prose prose-invert prose-sm">
                    {analysisResult.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
                    <Button variant="outline" className="!py-2 !text-xs" onClick={() => { setAnalysisResult(''); setAnalysisInput(''); }}>
                      Clear
                    </Button>
                    <Button variant="outline" className="!py-2 !text-xs" onClick={() => navigator.clipboard.writeText(analysisResult)}>
                      Copy Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <FileText size={48} className="text-slate-500 mb-4" />
                  <p className="text-slate-400 text-sm">Results will appear here after analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
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

        {/* Articles Grid */}
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
                  <div className="text-xs font-semibold text-slate-500">By <span className="text-lexcora-blue">{article.author}</span></div>
                  <button onClick={() => onArticleClick?.(article.slug)} className="text-sm font-bold text-lexcora-gold hover:text-yellow-500 flex items-center gap-1 transition-colors">
                    {t.readMore} <Arrow size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
