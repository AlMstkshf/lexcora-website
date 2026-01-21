import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Insights } from './components/Insights';
import { Footer } from './components/Footer';
import { Testimonials } from './components/Testimonials';
import { About } from './components/About';
import { NotFound } from './components/NotFound';
import { PageHelmet } from './components/PageHelmet';
import { Language } from './types';

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
const buildLangPath = (lang: Language, path: string = '/') => {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${normalized}`;
};

const LoadingScreen = () => (
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

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
};

const HomePage: React.FC<{ lang: Language; onContactClick: () => void }> = ({ lang, onContactClick }) => {
  const navigate = useNavigate();
  const isEnglish = lang === 'en';

  return (
    <>
      <PageHelmet
        title={
          isEnglish
            ? 'Best Law Firm Management System | Lexcora ERP'
            : 'أفضل نظام لإدارة مكاتب المحاماة | Lexcora ERP'
        }
        description={
          isEnglish
            ? 'Lexcora ERP delivers GCC-ready legal workflows, bilingual client portals, trust accounting, and AI compliance tailored for Middle East law firms.'
            : 'ليكسورا ERP يقدم مسارات عمل قانونية جاهزة للخليج، بوابة عملاء ثنائية اللغة، إدارة القضايا والفوترة، وذكاءً للامتثال مصمم خصيصًا لمكاتب المحاماة في الشرق الأوسط.'
        }
        lang={lang}
      />
      <Hero lang={lang} onContactClick={onContactClick} />
      <Features lang={lang} />
      <Testimonials lang={lang} />
      <Insights
        lang={lang}
        onViewAll={() => navigate(buildLangPath(lang, '/insights'))}
        onArticleClick={(slug) => navigate(buildLangPath(lang, `/insights/${slug}`))}
      />
    </>
  );
};

const FeaturesPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isEnglish = lang === 'en';
  return (
    <div className="pt-24 pb-16 bg-slate-50">
      <PageHelmet
        title={isEnglish ? 'Features | Lexcora' : 'المزايا | ليكسورا'}
        description={
          isEnglish
            ? 'Explore Lexcora features: productivity, governance, intelligence, and integrations tailored to UAE legal teams.'
            : 'اكتشف مزايا ليكسورا: الإنتاجية والحوكمة والذكاء والتكاملات المخصصة للفرق القانونية في الإمارات.'
        }
        lang={lang}
      />
      <div className="container mx-auto px-6 max-w-5xl text-center mb-12">
        <span className="text-lexcora-gold font-bold tracking-widest text-sm uppercase">
          {isEnglish ? 'Capabilities' : 'الإمكانات'}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-lexcora-blue mt-4">
          {isEnglish ? 'Everything in one secure workspace' : 'كل ما تحتاجه في مساحة آمنة واحدة'}
        </h1>
        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
          {isEnglish
            ? 'Purpose-built modules for casework, client experience, compliance, and intelligence—optimized for UAE practices.'
            : 'وحدات مصممة خصيصاً لإدارة القضايا وتجربة العملاء والامتثال والذكاء، ومهيأة للممارسات القانونية في الإمارات.'}
        </p>
      </div>
      <Features lang={lang} />
      <Testimonials lang={lang} />
    </div>
  );
};

const CaseStudiesPage: React.FC<{ lang: Language; onContactClick: () => void }> = ({ lang, onContactClick }) => (
  <>
    <PageHelmet
      title={lang === 'en' ? 'Case Studies | Lexcora' : 'دراسات حالة | ليكسورا'}
      description={
        lang === 'en'
          ? 'See how UAE firms use Lexcora to improve compliance, client delivery, and operational efficiency.'
          : 'اطلع على كيفية استفادة الشركات القانونية في الإمارات من ليكسورا لتحسين الامتثال وتجربة العملاء والكفاءة التشغيلية.'
      }
      lang={lang}
    />
    <Suspense fallback={<div className="p-8">Loading case studies...</div>}>
      <CaseStudies lang={lang} onContactClick={onContactClick} />
    </Suspense>
  </>
);

const PricingPage: React.FC<{ lang: Language; onContactClick: () => void }> = ({ lang, onContactClick }) => (
  <>
    <PageHelmet
      title={lang === 'en' ? 'Pricing | Lexcora' : 'الأسعار | ليكسورا'}
      description={
        lang === 'en'
          ? 'Choose a Lexcora plan built for UAE legal teams with transparent tiers, annual savings, and enterprise support.'
          : 'اختر خطة ليكسورا المصممة لفرق القانون في الإمارات مع شرائح واضحة ومدخرات سنوية ودعم للمؤسسات.'
      }
      lang={lang}
    />
    <Suspense fallback={<div className="p-8">Loading pricing...</div>}>
      <Pricing lang={lang} onContactClick={onContactClick} />
    </Suspense>
  </>
);

const TrialPage: React.FC<{ lang: Language }> = ({ lang }) => (
  <>
    <PageHelmet
      title={lang === 'en' ? 'Start your trial | Lexcora' : 'ابدأ تجربتك | ليكسورا'}
      description={
        lang === 'en'
          ? 'Start a guided Lexcora trial to experience UAE-first legal workflows, secure client portal, and AI insights.'
          : 'ابدأ تجربة موجهة لليكسورا لتجربة تدفقات العمل القانونية الأولى في الإمارات وبوابة العملاء الآمنة ورؤى الذكاء الاصطناعي.'
      }
      lang={lang}
    />
    <Suspense fallback={<div className="p-8">Loading trial...</div>}>
      <TrialSignup lang={lang} />
    </Suspense>
  </>
);


const ContactRoute: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  const isEnglish = lang === 'en';

  return (
    <>
      <PageHelmet
        title={isEnglish ? 'Contact | Lexcora' : 'اتصل بنا | ليكسورا'}
        description={
          isEnglish
            ? 'Talk with Lexcora about legal operations, pricing, and implementation for your firm.'
            : 'تواصل مع ليكسورا حول العمليات القانونية، التسعير، والتنفيذ لشركتك.'
        }
        lang={lang}
      />
      <Suspense fallback={<div className="p-8">Loading contact...</div>}>
        <ContactModal
          isOpen
          variant="page"
          onClose={() => navigate(buildLangPath(lang))}
          lang={lang}
        />
      </Suspense>
    </>
  );
};

const PrivacyPage: React.FC<{ lang: Language }> = ({ lang }) => (
  <>
    <PageHelmet
      title={lang === 'en' ? 'Privacy Policy | Lexcora' : 'سياسة الخصوصية | ليكسورا'}
      description={
        lang === 'en'
          ? 'Understand how Lexcora protects legal data with governance, encryption, and transparent privacy controls.'
          : 'تعرف على كيفية حماية ليكسورا للبيانات القانونية عبر الحوكمة والتشفير وضوابط الخصوصية الشفافة.'
      }
      lang={lang}
    />
    <Suspense fallback={<div className="p-8">Loading policy...</div>}>
      <PrivacyPolicy lang={lang} />
    </Suspense>
  </>
);

const InsightsRoute: React.FC<{ lang: Language }> = ({ lang }) => {
  const navigate = useNavigate();
  return (
    <>
      <PageHelmet
        title={lang === 'en' ? 'Insights | Lexcora' : 'الرؤى | ليكسورا'}
        description={
          lang === 'en'
            ? 'Read Lexcora insights on UAE legal tech, compliance, and operational excellence.'
            : 'اقرأ رؤى ليكسورا حول تقنيات القانون في الإمارات والامتثال والتميز التشغيلي.'
        }
        lang={lang}
      />
      <Suspense fallback={<div className="p-8">Loading insights...</div>}>
        <InsightsPage lang={lang} onArticleClick={(slug) => navigate(buildLangPath(lang, `/insights/${slug}`))} />
      </Suspense>
    </>
  );
};

const ArticleRoute: React.FC<{ lang: Language }> = ({ lang }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  if (!slug) {
    return <NotFound lang={lang} />;
  }

  return (
    <Suspense fallback={<div className="p-8">Loading article...</div>}>
      <ArticleDetail lang={lang} articleSlug={slug} onBack={() => navigate(buildLangPath(lang, '/insights'))} />
    </Suspense>
  );
};

const AppLayout: React.FC<{
  lang: Language;
  setLang: (lang: Language) => void;
  onLoginClick: () => void;
}> = ({ lang, setLang, onLoginClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const langPrefix = `/${lang}`;
  const pathWithLang = (path: string = '/') => buildLangPath(lang, path);
  const handleContactClick = () => navigate(pathWithLang('/contact'));

  return (
    <div className="min-h-screen bg-white transition-opacity duration-1000">
      <Header
        lang={lang}
        setLang={setLang}
        onLoginClick={onLoginClick}
        currentPath={location.pathname}
      />

      <main className="animate-fade-in">
        <Routes>
          <Route path="/" element={<Navigate to={pathWithLang('/')} replace />} />
          <Route path={pathWithLang('/')} element={<HomePage lang={lang} onContactClick={handleContactClick} />} />
          <Route path={pathWithLang('/features')} element={<FeaturesPage lang={lang} />} />
          <Route path={pathWithLang('/pricing')} element={<PricingPage lang={lang} onContactClick={handleContactClick} />} />
          <Route path={pathWithLang('/case-studies')} element={<CaseStudiesPage lang={lang} onContactClick={handleContactClick} />} />
          <Route path={pathWithLang('/about')} element={<About lang={lang} />} />
          <Route path={pathWithLang('/free-trial')} element={<TrialPage lang={lang} />} />
          <Route path={`${langPrefix}/trial`} element={<Navigate to={pathWithLang('/free-trial')} replace />} />
          <Route path={pathWithLang('/contact')} element={<ContactRoute lang={lang} />} />
          <Route path={pathWithLang('/privacy')} element={<PrivacyPage lang={lang} />} />
          <Route path={pathWithLang('/insights')} element={<InsightsRoute lang={lang} />} />
          <Route path={`${langPrefix}/insights/:slug`} element={<ArticleRoute lang={lang} />} />
          <Route path="*" element={<NotFound lang={lang} />} />
        </Routes>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

const AppContainer: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/(en|ar)(?=\/|$)/);
      if (match) {
        return match[1] as Language;
      }
    }
    return 'en';
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    if (lang === 'ar') {
      document.body.classList.remove('font-sans');
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
      document.body.classList.add('font-sans');
    }
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const matched = location.pathname.match(/^\/(en|ar)(?=\/|$)/);
    if (!matched) {
      const normalizedPath = location.pathname === '/' ? '' : location.pathname;
      navigate(`/en${normalizedPath}${location.search}`, { replace: true });
      return;
    }
    const routeLang = matched[1] as Language;
    if (routeLang !== lang) {
      setLang(routeLang);
    }
  }, [location.pathname, location.search, lang, navigate]);

  const handleLangChange = (target: Language) => {
    if (target === lang) return;
    const strippedPath = location.pathname.replace(/^\/(en|ar)/, '') || '/';
    const suffix = strippedPath === '/' ? '' : strippedPath.startsWith('/') ? strippedPath : `/${strippedPath}`;
    navigate(`/${target}${suffix}${location.search}`, { replace: true });
    setLang(target);
  };

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <AppLayout
        lang={lang}
        setLang={handleLangChange}
        onLoginClick={() => setLoginOpen(true)}
      />

      <Suspense fallback={null}>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} />
      </Suspense>
      <Suspense fallback={null}>
        <ChatWidget lang={lang} />
      </Suspense>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  );
}

export default App;
