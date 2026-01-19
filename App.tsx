import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Insights } from './components/Insights';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ContactModal } from './components/ContactModal';
import { ChatWidget } from './components/ChatWidget';
import { Testimonials } from './components/Testimonials';
import { CaseStudies } from './components/CaseStudies';
import { TrialSignup } from './components/TrialSignup';
import { InsightsPage } from './components/InsightsPage';
import { ArticleDetail } from './components/ArticleDetail';
import { Pricing } from './components/Pricing';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Language, View } from './types';
import { Loader2 } from 'lucide-react';

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
          <CaseStudies lang={lang} onNavigate={handleNavigate} />
        )}
        {currentView === 'trial' && (
          <TrialSignup lang={lang} />
        )}
        {currentView === 'pricing' && (
          <Pricing lang={lang} onNavigate={handleNavigate} />
        )}
        {currentView === 'privacy' && (
          <PrivacyPolicy lang={lang} onNavigate={handleNavigate} />
        )}
        {currentView === 'insights' && (
          <InsightsPage lang={lang} onArticleClick={handleArticleClick} />
        )}
        {currentView === 'article' && selectedArticleId && (
          <ArticleDetail 
            lang={lang} 
            articleId={selectedArticleId} 
            onBack={() => handleNavigate('insights')}
          />
        )}
      </main>

      <Footer lang={lang} onNavigate={handleNavigate} />
      
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />
      <ChatWidget lang={lang} />
    </div>
  );
}

export default App;