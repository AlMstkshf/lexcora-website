import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
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
        title={isEnglish ? 'Lexcora | UAE-first Legal ERP' : 'ليكسورا | منصة تخطيط الموارد القانونية'}
        description={
          isEnglish
            ? 'Streamline UAE legal operations with Lexcora: case management, client portal, and AI insights built for compliance.'
            : 'بسّط عمليات القانون في الإمارات مع ليكسورا: إدارة القضايا وبوابة العملاء ورؤى الذكاء الاصطناعي المصممة للامتثال.'
        }
      />
      <Hero lang={lang} onContactClick={onContactClick} />
      <Features lang={lang} />
      <Testimonials lang={lang} />
      <Insights
        lang={lang}
        onViewAll={() => navigate('/insights')}
        onArticleClick={(id) => navigate(`/insights/${id}`)}
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
    />
    <Suspense fallback={<div className="p-8">Loading trial...</div>}>
      <TrialSignup lang={lang} />
    </Suspense>
  </>
);

const PrivacyPage: React.FC<{ lang: Language }> = ({ lang }) => (
  <>
    <PageHelmet
      title={lang === 'en' ? 'Privacy Policy | Lexcora' : 'سياسة الخصوصية | ليكسورا'}
      description={
        lang === 'en'
          ? 'Understand how Lexcora protects legal data with governance, encryption, and transparent privacy controls.'
          : 'تعرف على كيفية حماية ليكسورا للبيانات القانونية عبر الحوكمة والتشفير وضوابط الخصوصية الشفافة.'
      }
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
      />
      <Suspense fallback={<div className="p-8">Loading insights...</div>}>
        <InsightsPage lang={lang} onArticleClick={(id) => navigate(`/insights/${id}`)} />
      </Suspense>
    </>
  );
};

const ArticleRoute: React.FC<{ lang: Language }> = ({ lang }) => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  if (!articleId) {
    return <NotFound lang={lang} />;
  }

  return (
    <Suspense fallback={<div className="p-8">Loading article...</div>}>
      <ArticleDetail lang={lang} articleId={articleId} onBack={() => navigate('/insights')} />
    </Suspense>
  );
};

const AppLayout: React.FC<{
  lang: Language;
  setLang: (lang: Language) => void;
  onLoginClick: () => void;
  onContactClick: () => void;
}> = ({ lang, setLang, onLoginClick, onContactClick }) => {
  const location = useLocation();

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
          <Route path="/" element={<HomePage lang={lang} onContactClick={onContactClick} />} />
          <Route path="/features" element={<FeaturesPage lang={lang} />} />
          <Route path="/pricing" element={<PricingPage lang={lang} onContactClick={onContactClick} />} />
          <Route path="/case-studies" element={<CaseStudiesPage lang={lang} onContactClick={onContactClick} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/trial" element={<TrialPage lang={lang} />} />
          <Route path="/privacy" element={<PrivacyPage lang={lang} />} />
          <Route path="/insights" element={<InsightsRoute lang={lang} />} />
          <Route path="/insights/:articleId" element={<ArticleRoute lang={lang} />} />
          <Route path="*" element={<NotFound lang={lang} />} />
        </Routes>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [loginOpen, setLoginOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

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

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout
        lang={lang}
        setLang={setLang}
        onLoginClick={() => setLoginOpen(true)}
        onContactClick={() => setContactOpen(true)}
      />

      <Suspense fallback={null}>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />
      </Suspense>
      <Suspense fallback={null}>
        <ChatWidget lang={lang} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
