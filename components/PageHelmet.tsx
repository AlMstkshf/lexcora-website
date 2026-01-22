import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../types';

interface PageHelmetProps {
  title: string;
  description: string;
  lang: Language;
  imageUrl?: string;
  schemaType?: 'SoftwareApplication' | 'ProfessionalService';
  operatingSystem?: string;
  faqs?: { question: string; answer: string }[];
}

const BRAND_OG_IMAGE = '/og/lexcora-og.png';
const BASE_DOMAIN = 'https://lexcora-mbh.com';
const KEYWORDS = [
  'Lexcora ERP',
  'Best Law Firm Management System',
  'ERP for Lawyers',
  'Legal Tech',
  'نظام إدارة مكاتب محاماة',
  'UAE legal software',
  'Middle East legal workflows',
];
const STRUCTURED_DATA_ID = 'lexcora-softwareapp-jsonld';
const DEFAULT_FAQS: Record<'en' | 'ar', { question: string; answer: string }[]> = {
  en: [
    {
      question: 'What is Lexcora ERP?',
      answer:
        'Lexcora ERP is a cloud-based practice management suite for law firms, built for GCC compliance, bilingual client experiences, and trust accounting.',
    },
    {
      question: 'Which operating systems does Lexcora support?',
      answer: 'Lexcora runs in any modern browser on Windows or macOS and is fully responsive for tablets and mobile devices.',
    },
    {
      question: 'How long does implementation take?',
      answer: 'Most firms launch within 10–14 days with guided onboarding, data migration, and user training included.',
    },
    {
      question: 'Is Lexcora secure and compliant in the UAE?',
      answer: 'Yes. Lexcora applies role-based access, encryption in transit and at rest, audit logs, and workflows aligned to UAE data governance.',
    },
  ],
  ar: [
    {
      question: 'ما هو ليكسورا ERP؟',
      answer:
        'ليكسورا ERP هو منصة سحابية لإدارة مكاتب المحاماة، مصممة للامتثال في الخليج، وتجارب عملاء ثنائية اللغة، وحسابات أمانات موثوقة.',
    },
    {
      question: 'ما هي أنظمة التشغيل التي يدعمها ليكسورا؟',
      answer: 'يعمل ليكسورا على أي متصفح حديث في ويندوز أو ماك، وهو متجاوب بالكامل للأجهزة اللوحية والهواتف.',
    },
    {
      question: 'كم يستغرق التنفيذ؟',
      answer: 'تطلق معظم الشركات المنصة خلال 10 إلى 14 يوماً مع إعداد موجه، وترحيل بيانات، وتدريب للمستخدمين.',
    },
    {
      question: 'هل ليكسورا آمن ومتوافق في الإمارات؟',
      answer: 'نعم، يعتمد ليكسورا صلاحيات وصول حسب الدور، وتشفيراً أثناء النقل والتخزين، وسجلات تدقيق، ومسارات عمل متوافقة مع حوكمة البيانات في الإمارات.',
    },
  ],
};

const resolveBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.origin) {
    const { origin } = window.location;
    if (origin.includes('localhost')) {
      return origin;
    }
  }
  return BASE_DOMAIN;
};

const ensureMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const ensureLinkTag = (rel: string, href: string, hreflang?: string) => {
  if (!href) return;
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let link = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    if (hreflang) {
      link.setAttribute('hreflang', hreflang);
    }
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const ensureJsonLd = (data: Record<string, unknown>) => {
  let script = document.getElementById(STRUCTURED_DATA_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = STRUCTURED_DATA_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export const PageHelmet: React.FC<PageHelmetProps> = ({
  title,
  description,
  lang,
  imageUrl,
  schemaType = 'SoftwareApplication',
  operatingSystem = 'Web (browser-based)',
  faqs,
}) => {
  const location = useLocation();
  const localizedFaqs = faqs && faqs.length ? faqs : DEFAULT_FAQS[lang];
  const inLanguage = lang === 'ar' ? 'ar-SA' : 'en-US';
  const localizedName =
    lang === 'ar' ? 'Lexcora ERP لإدارة مكاتب المحاماة' : 'Lexcora ERP for Law Firms';

  useEffect(() => {
    document.title = title;
    const baseUrl = resolveBaseUrl().replace(/\/$/, '');
    const pathWithoutLang = location.pathname.replace(/^\/(en|ar)/, '') || '/';
    const suffix = pathWithoutLang === '/' ? '' : pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
    const langPrefix = `/${lang}`;
    const pathWithLang = `${langPrefix}${suffix}`;
    const canonicalUrl = `${baseUrl}${pathWithLang === '/' ? '' : pathWithLang}`;
    const ogImage = `${baseUrl}${(imageUrl || BRAND_OG_IMAGE).startsWith('/') ? imageUrl || BRAND_OG_IMAGE : `/${imageUrl}`}`;
    const alternateEn = `${baseUrl}/en${suffix}`;
    const alternateAr = `${baseUrl}/ar${suffix}`;
    const trialUrl = `${baseUrl}${langPrefix}/free-trial`;

    ensureMetaTag('name', 'description', description);
    ensureMetaTag('name', 'keywords', KEYWORDS.join(', '));
    ensureMetaTag('property', 'og:type', 'website');
    ensureMetaTag('property', 'og:title', title);
    ensureMetaTag('property', 'og:description', description);
    ensureMetaTag('property', 'og:url', canonicalUrl);
    ensureMetaTag('property', 'og:locale', lang === 'ar' ? 'ar_SA' : 'en_US');
    ensureMetaTag('property', 'og:image', ogImage);
    ensureMetaTag('property', 'og:image:alt', 'Lexcora ERP for law firms');
    ensureMetaTag('property', 'og:image:width', '1200');
    ensureMetaTag('property', 'og:image:height', '630');

    ensureMetaTag('name', 'twitter:card', 'summary_large_image');
    ensureMetaTag('name', 'twitter:title', title);
    ensureMetaTag('name', 'twitter:description', description);
    ensureMetaTag('name', 'twitter:image', ogImage);

    ensureLinkTag('canonical', canonicalUrl);
    ensureLinkTag('alternate', alternateEn, 'en-US');
    ensureLinkTag('alternate', alternateAr, 'ar-SA');

    const softwareNode = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${canonicalUrl}#lexcora-software`,
      name: localizedName,
      alternateName: 'Lexcora Legal Cloud',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'LegalPracticeManagementSoftware',
      operatingSystem,
      url: canonicalUrl,
      image: ogImage,
      inLanguage,
      description,
      keywords: KEYWORDS,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'AED',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Case management',
        'Client portal',
        'Middle East compliance',
        'Operational insights',
        'Secure document storage',
      ],
      softwareHelp: canonicalUrl,
      potentialAction: {
        '@type': 'Action',
        name: lang === 'ar' ? 'بدء تجربة مجانية' : 'Start a free trial',
        target: trialUrl,
      },
      creator: {
        '@type': 'Organization',
        name: 'Lexcora',
        url: baseUrl,
      },
    };

    const professionalServiceNode =
      schemaType === 'ProfessionalService'
        ? {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            '@id': `${canonicalUrl}#lexcora-service`,
            name: localizedName,
            description,
            serviceType: lang === 'ar' ? 'خدمة تخطيط موارد المؤسسة لمكاتب المحاماة' : 'Law Firm ERP implementation and support',
            areaServed: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Bahrain'],
            provider: { '@type': 'Organization', name: 'Lexcora', url: baseUrl },
            url: canonicalUrl,
            image: ogImage,
            inLanguage,
            hasProduct: { '@id': softwareNode['@id'] },
          }
        : null;

    const faqNode = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faqs`,
      inLanguage,
      mainEntity: localizedFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    const graph = professionalServiceNode
      ? [professionalServiceNode, softwareNode, faqNode]
      : [softwareNode, faqNode];

    ensureJsonLd({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }, [
    title,
    description,
    lang,
    imageUrl,
    schemaType,
    operatingSystem,
    localizedFaqs,
    location.pathname,
    localizedName,
  ]);

  return null;
};
