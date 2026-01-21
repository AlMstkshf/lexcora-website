import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { CONTENT } from '../constants';
import { Button } from './Button';
import { ArrowRight, ArrowLeft, CheckCircle, Phone, Award } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onContactClick }) => {
  const t = CONTENT[lang].hero;
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();
  const pathWithLang = (path: string) => `/${lang}${path}`;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-12 overflow-hidden bg-slate-50">
      {/* Background Graphics */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-lexcora-blue/5 skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-lexcora-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center mb-16">
        
        {/* Text Content */}
        <div className="space-y-8">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexcora-blue/5 border border-lexcora-blue/10 opacity-0 animate-fade-in-up stagger-1"
          >
            <Award size={14} className="text-lexcora-gold" />
            <span className="text-xs font-semibold text-lexcora-blue tracking-wide uppercase">
              {t.trustBadge}
            </span>
          </div>

          <h1 
            className="text-5xl lg:text-7xl font-serif font-bold text-lexcora-blue leading-tight opacity-0 animate-fade-in-up stagger-2"
          >
            {t.title}
          </h1>
          
          <p 
            className="text-xl text-slate-600 max-w-lg leading-relaxed opacity-0 animate-fade-in-up stagger-3"
          >
            {t.subtitle}
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up stagger-3"
          >
            <Button 
              variant="primary" 
              className="shadow-xl shadow-lexcora-gold/20"
              onClick={() => navigate(pathWithLang('/free-trial'))}
            >
              {t.ctaPrimary}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={onContactClick}
            >
              <Phone size={18} /> {t.ctaCallback}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(pathWithLang('/features'))}
            >
              {t.ctaSecondary} <Arrow size={18} />
            </Button>
          </div>

          <div 
            className="pt-8 border-t border-slate-200 flex flex-wrap gap-6 text-sm font-medium text-slate-500 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
             <span className="flex items-center gap-2"><CheckCircle size={16} className="text-lexcora-gold" /> UAE Compliance Ready</span>
             <span className="flex items-center gap-2"><CheckCircle size={16} className="text-lexcora-gold" /> Bank-Grade Security</span>
             <span className="flex items-center gap-2"><CheckCircle size={16} className="text-lexcora-gold" /> 24/7 Dedicated Support</span>
          </div>
        </div>

        {/* Hero Image / Dashboard Mockup */}
        <div 
          className="relative lg:h-[600px] flex items-center justify-center opacity-0 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          <div className="relative w-full max-w-lg aspect-[4/3] bg-lexcora-blue rounded-lg shadow-2xl p-4 border border-slate-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="h-full w-full bg-slate-800 rounded overflow-hidden flex flex-col">
              <div className="h-8 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 p-6 grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-slate-700/50 rounded h-full animate-pulse"></div>
                <div className="col-span-2 space-y-4">
                  <div className="h-32 bg-slate-700/30 rounded border border-slate-600/50"></div>
                  <div className="h-24 bg-slate-700/30 rounded border border-slate-600/50"></div>
                  <div className="flex gap-4">
                    <div className="h-20 w-1/2 bg-lexcora-gold/20 rounded border border-lexcora-gold/30"></div>
                    <div className="h-20 w-1/2 bg-slate-700/30 rounded border border-slate-600/50"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-12 bottom-20 bg-white p-4 rounded-lg shadow-xl border-l-4 border-lexcora-gold max-w-[200px] hidden md:block">
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">Alert</div>
              <div className="text-sm font-semibold text-lexcora-blue">Appeal Deadline: Case #4922</div>
              <div className="text-xs text-red-500 mt-1 font-mono">04:22:15 remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Marquee */}
      <div className="w-full bg-white py-12 border-y border-slate-100 mt-12 overflow-hidden">
        <div className="container mx-auto px-6 mb-6">
           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Powering Industry Leaders Across the Emirates</p>
        </div>
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-16 px-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <span className="text-2xl font-serif font-bold text-slate-800">AL MANSOORI & CO</span>
             <span className="text-2xl font-serif font-bold text-slate-800">STERLING LEGAL</span>
             <span className="text-2xl font-serif font-bold text-slate-800">DUBAI COUNSEL</span>
             <span className="text-2xl font-serif font-bold text-slate-800">KHALIL INT'L</span>
             <span className="text-2xl font-serif font-bold text-slate-800">MARIA ISLAND ADVISORS</span>
             <span className="text-2xl font-serif font-bold text-slate-800">EMIRATES LAW GROUP</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-16 px-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <span className="text-2xl font-serif font-bold text-slate-800">AL MANSOORI & CO</span>
             <span className="text-2xl font-serif font-bold text-slate-800">STERLING LEGAL</span>
             <span className="text-2xl font-serif font-bold text-slate-800">DUBAI COUNSEL</span>
             <span className="text-2xl font-serif font-bold text-slate-800">KHALIL INT'L</span>
             <span className="text-2xl font-serif font-bold text-slate-800">MARIA ISLAND ADVISORS</span>
             <span className="text-2xl font-serif font-bold text-slate-800">EMIRATES LAW GROUP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
