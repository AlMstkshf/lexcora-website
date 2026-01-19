import React, { useState, useEffect, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Insights } from './components/Insights';
import { Footer } from './components/Footer';
import { Testimonials } from './components/Testimonials';
import { Language, View } from './types';
import { Loader2 } from 'lucide-react';

// Lazy-load large route/modal components to keep initial bundle small
const InsightsPage = React.lazy(() => import('./components/InsightsPage').then(m => ({ default: m.InsightsPage })));
const ArticleDetail = React.lazy(() => import('./components/ArticleDetail').then(m => ({ default: m.ArticleDetail })));
const CaseStudies = React.lazy(() => import('./components/CaseStudies').then(m => ({ default: m.CaseStudies })));
const TrialSignup = React.lazy(() => import('./components/TrialSignup').then(m => ({ default: m.TrialSignup })));
const Pricing = React.lazy(() => import('./components/Pricing').then(m => ({ default: m.Pricing })));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const LoginModal = React.lazy(() => import('./components/LoginModal').then(m => ({ default: m.LoginModal })));
const ContactModal = React.lazy(() => import('./components/ContactModal').then(m => ({ default: m.ContactModal })));
const ChatWidget = React.lazy(() => import('./components/ChatWidget').then(m => ({ default: m.ChatWidget })));

// Note: `Insights` (home preview list) remains eagerly loaded for quick home render; full `InsightsPage` is lazy.

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Handle RTL/LTR document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Switch font based on language
    if (lang === 'ar') {
      document.body.classList.remove('font-sans');
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
      document.body.classList.add('font-sans');
    }
  }, [lang]);

  useEffect(() => {
    // Initial entrance animation
    const timer = setTimeout(() => setIsAppLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (view: View, sectionId?: string) => {
    if (sectionId === 'contact-modal') {
      setContactOpen(true);
      return;
    }

    setCurrentView(view);
    if (view !== 'article') {
      setSelectedArticleId(null);
    }
    
    setTimeout(() => {
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-lexcora-blue flex flex-col items-center justify-center text-white z-[100]">
        <div className="w-16 h-16 bg-lexcora-gold rounded-sm flex items-center justify-center animate-bounce mb-4">
           <span className="text-lexcora-blue font-serif font-bold text-3xl">L</span>
        </div>
        <h2 className="text-xl font-serif font-bold tracking-widest text-lexcora-gold animate-pulse">LEXCORA</h2>
        <div className="mt-8 flex items-center gap-2 text-slate-500 text-xs">
          <Loader2 size={14} className="animate-spin" /> UAE Compliance Check...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white transition-opacity duration-1000">
      <Header 
        lang={lang} 
        setLang={setLang} 
        onLoginClick={() => setLoginOpen(true)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      
      <main className="animate-fade-in">
        {currentView === 'home' && (
          <>
            <Hero lang={lang} onNavigate={handleNavigate} />
            <Features lang={lang} />
            <Testimonials lang={lang} />
            <Insights lang={lang} onNavigate={handleNavigate} onArticleClick={handleArticleClick} />
          </>
        )}
        {currentView === 'case-studies' && (
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <CaseStudies lang={lang} onNavigate={handleNavigate} />
          </Suspense>
        )}
        {currentView === 'trial' && (
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <TrialSignup lang={lang} />
          </Suspense>
        )}
        {currentView === 'pricing' && (
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <Pricing lang={lang} onNavigate={handleNavigate} />
          </Suspense>
        )}
        {currentView === 'privacy' && (
          <Suspense fallback={<div className="p-8">Loading...</div>}>
            <PrivacyPolicy lang={lang} onNavigate={handleNavigate} />
          </Suspense>
        )}
        {currentView === 'insights' && (
          <Suspense fallback={<div className="p-8">Loading insights...</div>}>
            <InsightsPage lang={lang} onArticleClick={handleArticleClick} />
          </Suspense>
        )}
        {currentView === 'article' && selectedArticleId && (
          <Suspense fallback={<div className="p-8">Loading article...</div>}>
            <ArticleDetail 
              lang={lang} 
              articleId={selectedArticleId} 
              onBack={() => handleNavigate('insights')}
            />
          </Suspense>
        )}
      </main>

      <Footer lang={lang} onNavigate={handleNavigate} />
      
      <Suspense fallback={null}>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />
      </Suspense>
      <Suspense fallback={null}>
        <ChatWidget lang={lang} />
      </Suspense>
    </div>
  );
}

export default App;