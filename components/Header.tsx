import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User } from 'lucide-react';
import { Language } from '../types';
import { CONTENT } from '../constants';
import { Button } from './Button';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onLoginClick: () => void;
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onLoginClick, currentPath }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = CONTENT[lang].nav;
  const navigate = useNavigate();
  const pathWithLang = (path: string) => `/${lang}${path === '/' ? '' : path}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { label: t.home, to: pathWithLang('/') },
    { label: t.features, to: pathWithLang('/features') },
    { label: t.caseStudies, to: pathWithLang('/case-studies') },
    { label: t.pricing, to: pathWithLang('/pricing') },
    { label: t.insights, to: pathWithLang('/insights') },
    { label: t.contact, to: pathWithLang('/contact') },
    { label: lang === 'en' ? 'About' : 'حول', to: pathWithLang('/about') },
  ];

  const navLinkBase = `text-sm font-medium hover:text-lexcora-gold transition-colors relative group ${
    isScrolled ? 'text-gray-300' : 'text-lexcora-blue'
  }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-lexcora-blue/95 backdrop-blur-md shadow-xl py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="LEXCORA - Go to Homepage"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 bg-lexcora-gold rounded-sm flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
            <span className="text-lexcora-blue font-serif font-bold text-2xl">L</span>
          </div>
          <span
            className={`text-2xl font-serif font-bold tracking-widest ${
              isScrolled ? 'text-white' : 'text-lexcora-blue'
            }`}
          >
            LEXCORA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isHome = item.to === pathWithLang('/');
            const isItemActive = isHome
              ? currentPath === item.to
              : currentPath === item.to || currentPath.startsWith(`${item.to}/`);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={isHome}
                className={({ isActive }) => `${navLinkBase} ${isActive || isItemActive ? 'text-lexcora-gold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
                {isItemActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-lexcora-gold transform scale-x-100 transition-transform duration-300"></span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-lexcora-gold ${
              isScrolled ? 'text-white' : 'text-lexcora-blue'
            }`}
            aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            <Globe size={16} />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          <a
            href="https://user.lexcora-mbh.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 !py-2 !px-4 rounded-md border font-semibold transition-all duration-300 text-sm tracking-wide uppercase ${
              !isScrolled
                ? '!border-lexcora-blue !text-lexcora-blue hover:!bg-lexcora-blue/5'
                : '!border-white/60 !text-white hover:!bg-white/10'
            }`}
            aria-label={`${t.portal} - Open client portal`}
          >
            <User size={16} />
            {t.portal}
          </a>

          <Button
            variant="primary"
            className="!py-2 !px-4"
            aria-label={`${t.freeTrial} - Start free trial`}
            onClick={() => navigate(pathWithLang('/free-trial'))}
          >
            {t.freeTrial}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-lexcora-gold"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-lexcora-blue border-t border-gray-800 p-6 flex flex-col gap-4 shadow-2xl lg:hidden animate-fade-in-up">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-left text-gray-300 hover:text-lexcora-gold text-lg py-2 border-b border-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="h-px bg-gray-700 my-2"></div>
          <button
            onClick={toggleLang}
            className="text-left text-gray-300 hover:text-lexcora-gold flex items-center gap-2 py-2"
            aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            <Globe size={18} /> {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <a
            href="https://user.lexcora-mbh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold border border-white/60 text-white hover:bg-white/10 transition-colors uppercase text-sm"
            aria-label={`${t.portal} - Open client portal`}
          >
            {t.portal}
          </a>
          <Button
            variant="primary"
            fullWidth
            aria-label={`${t.freeTrial} - Start free trial`}
            onClick={() => {
              setMobileMenuOpen(false);
              navigate(pathWithLang('/free-trial'));
            }}
          >
            {t.freeTrial}
          </Button>
        </div>
      )}
    </header>
  );
};
