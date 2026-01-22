import fs from 'node:fs/promises';
import path from 'node:path';

// Minimal AMP page factory to keep content static and valid
const ampPage = (page) => `<!doctype html>
<html amp lang="${page.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <link rel="canonical" href="${page.canonical}">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-boilerplate>body{animation:-amp-start 8s steps(1,end) 0s 1 normal both}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{animation:none}</style></noscript>
  <style amp-custom>
    body{margin:0;padding:0;font-family:'Cairo',sans-serif;background:#f9fafb;color:#0f172a;}
    .wrap{padding:32px 20px;text-align:center;max-width:760px;margin:0 auto;}
    h1{margin:0 0 12px;font-size:32px;line-height:1.2;}
    p{margin:0 0 20px;font-size:16px;line-height:1.6;}
    .cta{display:inline-block;padding:12px 18px;background:#b8860b;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;}
    amp-img{margin-top:20px;border-radius:12px;}
  </style>
</head>
<body>
  <main class="wrap">
    <h1>${page.title}</h1>
    <p>${page.description}</p>
    <a class="cta" href="${page.ctaHref}">${page.ctaText}</a>
    <amp-img src="${page.heroImg}" width="1200" height="630" layout="responsive" alt="${page.heroAlt}"></amp-img>
  </main>
</body>
</html>`;

const pages = [
  {
    lang: 'en',
    slug: '',
    canonical: 'https://lexcora-mbh.com/en',
    title: 'Lexcora ERP – Law Firm Management',
    description: 'GCC-ready legal workflows, bilingual client portals, and compliance.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP interface for law firms',
    ctaHref: 'https://lexcora-mbh.com/en/free-trial',
    ctaText: 'Start Free Trial'
  },
  {
    lang: 'en',
    slug: 'features',
    canonical: 'https://lexcora-mbh.com/en/features',
    title: 'Features | Lexcora ERP',
    description: 'Matter management, billing, trust accounting, and bilingual portals in one secure platform.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP feature overview',
    ctaHref: 'https://lexcora-mbh.com/en/free-trial',
    ctaText: 'Explore Features'
  },
  {
    lang: 'en',
    slug: 'pricing',
    canonical: 'https://lexcora-mbh.com/en/pricing',
    title: 'Pricing | Lexcora ERP',
    description: 'Transparent pricing for law firms in the GCC with compliance-ready modules.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP pricing',
    ctaHref: 'https://lexcora-mbh.com/en/contact',
    ctaText: 'Talk to Sales'
  },
  {
    lang: 'en',
    slug: 'case-studies',
    canonical: 'https://lexcora-mbh.com/en/case-studies',
    title: 'Case Studies | Lexcora ERP',
    description: 'See how regional law firms modernize operations with Lexcora ERP.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP case studies',
    ctaHref: 'https://lexcora-mbh.com/en/free-trial',
    ctaText: 'See Outcomes'
  },
  {
    lang: 'en',
    slug: 'about',
    canonical: 'https://lexcora-mbh.com/en/about',
    title: 'About Lexcora ERP',
    description: 'Built for Middle East legal teams with GCC compliance baked in.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'About Lexcora ERP',
    ctaHref: 'https://lexcora-mbh.com/en/contact',
    ctaText: 'Meet the Team'
  },
  {
    lang: 'en',
    slug: 'free-trial',
    canonical: 'https://lexcora-mbh.com/en/free-trial',
    title: 'Start Your Free Trial | Lexcora ERP',
    description: 'Test Lexcora ERP with your matters, clients, and billing flows.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP free trial',
    ctaHref: 'https://lexcora-mbh.com/en/free-trial',
    ctaText: 'Start Free Trial'
  },
  {
    lang: 'en',
    slug: 'contact',
    canonical: 'https://lexcora-mbh.com/en/contact',
    title: 'Contact Lexcora ERP',
    description: 'Talk to a product specialist about your firm’s workflows and compliance needs.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Contact Lexcora ERP',
    ctaHref: 'https://lexcora-mbh.com/en/contact',
    ctaText: 'Contact Us'
  },
  {
    lang: 'en',
    slug: 'privacy',
    canonical: 'https://lexcora-mbh.com/en/privacy',
    title: 'Privacy Policy | Lexcora ERP',
    description: 'How Lexcora ERP handles data protection, privacy, and regional compliance.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP privacy policy',
    ctaHref: 'https://lexcora-mbh.com/en/contact',
    ctaText: 'Privacy Questions'
  },
  {
    lang: 'en',
    slug: 'insights',
    canonical: 'https://lexcora-mbh.com/en/insights',
    title: 'Insights | Lexcora ERP',
    description: 'Legal operations insights for GCC firms: compliance, billing, and client service.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'Lexcora ERP insights',
    ctaHref: 'https://lexcora-mbh.com/en/insights',
    ctaText: 'Read Insights'
  },
  {
    lang: 'ar',
    slug: '',
    canonical: 'https://lexcora-mbh.com/ar',
    title: 'ليكسورا ERP لإدارة مكاتب المحاماة',
    description: 'حلول متوافقة مع أنظمة الخليج مع بوابة عملاء ثنائية اللغة.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'منصة ليكسورا لإدارة مكاتب المحاماة',
    ctaHref: 'https://lexcora-mbh.com/ar/free-trial',
    ctaText: 'ابدأ الفترة التجريبية'
  },
  {
    lang: 'ar',
    slug: 'features',
    canonical: 'https://lexcora-mbh.com/ar/features',
    title: 'المزايا | ليكسورا ERP',
    description: 'إدارة القضايا، الفوترة، حسابات الأمانات، وبوابة عملاء ثنائية اللغة في منصة واحدة.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'مزايا ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/free-trial',
    ctaText: 'اكتشف المزايا'
  },
  {
    lang: 'ar',
    slug: 'pricing',
    canonical: 'https://lexcora-mbh.com/ar/pricing',
    title: 'الأسعار | ليكسورا ERP',
    description: 'خطط تسعير شفافة لمكاتب المحاماة في الخليج مع جاهزية للامتثال.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'أسعار ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/contact',
    ctaText: 'تحدث مع المبيعات'
  },
  {
    lang: 'ar',
    slug: 'case-studies',
    canonical: 'https://lexcora-mbh.com/ar/case-studies',
    title: 'دراسات حالة | ليكسورا ERP',
    description: 'كيف طورت مكاتب المحاماة عملياتها باستخدام ليكسورا ERP.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'دراسات حالة ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/free-trial',
    ctaText: 'اطلع على النتائج'
  },
  {
    lang: 'ar',
    slug: 'about',
    canonical: 'https://lexcora-mbh.com/ar/about',
    title: 'عن ليكسورا ERP',
    description: 'منصة قانونية مصممة لفرق الخليج مع التزام كامل بالامتثال.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'عن ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/contact',
    ctaText: 'تعرّف علينا'
  },
  {
    lang: 'ar',
    slug: 'free-trial',
    canonical: 'https://lexcora-mbh.com/ar/free-trial',
    title: 'ابدأ الفترة التجريبية | ليكسورا ERP',
    description: 'جرّب ليكسورا ERP مع بيانات مكاتبك وعملائك.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'فترة تجريبية ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/free-trial',
    ctaText: 'ابدأ الآن'
  },
  {
    lang: 'ar',
    slug: 'contact',
    canonical: 'https://lexcora-mbh.com/ar/contact',
    title: 'تواصل معنا | ليكسورا ERP',
    description: 'تحدث مع متخصص المنتج حول احتياجات مكتبك القانونية.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'تواصل مع ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/contact',
    ctaText: 'اتصل بنا'
  },
  {
    lang: 'ar',
    slug: 'privacy',
    canonical: 'https://lexcora-mbh.com/ar/privacy',
    title: 'سياسة الخصوصية | ليكسورا ERP',
    description: 'نهج ليكسورا ERP لحماية البيانات والخصوصية والامتثال الإقليمي.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'سياسة الخصوصية ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/contact',
    ctaText: 'أسئلة الخصوصية'
  },
  {
    lang: 'ar',
    slug: 'insights',
    canonical: 'https://lexcora-mbh.com/ar/insights',
    title: 'مقالات | ليكسورا ERP',
    description: 'رؤى في العمليات القانونية والامتثال والفوترة لمكاتب الخليج.',
    heroImg: 'https://lexcora-mbh.com/og/lexcora-og.png',
    heroAlt: 'مقالات ليكسورا ERP',
    ctaHref: 'https://lexcora-mbh.com/ar/insights',
    ctaText: 'اقرأ المقالات'
  }
];

const writePage = async (page) => {
  const outDir = path.join(process.cwd(), 'public', 'amp', page.lang, page.slug || '');
  const outFile = path.join(outDir, 'index.html');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outFile, ampPage(page), 'utf8');
  return outFile;
};

const run = async () => {
  const written = await Promise.all(pages.map(writePage));
  written.forEach((file) => console.log(`AMP page generated: ${file}`));
};

run().catch((err) => {
  console.error('Failed to generate AMP pages:', err);
  process.exitCode = 1;
});
