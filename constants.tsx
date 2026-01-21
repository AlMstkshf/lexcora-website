import { 
  Briefcase, 
  Users, 
  ShieldCheck, 
  BrainCircuit, 
  Link as LinkIcon, 
  FileText, 
  Clock, 
  Lock, 
  LayoutDashboard, 
  MessageSquare, 
  FileCheck,
  Globe,
  Smartphone,
  Server
} from 'lucide-react';
import { ContentDictionary } from './types';

export const CONTENT: Record<'en' | 'ar', ContentDictionary> = {
  en: {
    nav: {
      home: "Home",
      features: "Capabilities",
      insights: "Insights Hub",
      caseStudies: "Success Stories",
      contact: "Contact",
      portal: "Client Login",
      demo: "Request Demo",
      freeTrial: "Start Free Trial",
      pricing: "Pricing"
    },
    hero: {
      title: "The Future of Legal Practice in the UAE",
      subtitle: "LEXCORA is the premier ERP suite designed for high-net-worth law firms. Seamlessly integrate productivity, governance, and client experience.",
      ctaPrimary: "Start Free Trial",
      ctaCallback: "Request a Callback",
      ctaSecondary: "Explore Features",
      trustBadge: "Trusted by Dubai's Leading Legal Consultants"
    },
    features: {
      sectionTitle: "Enterprise-Grade Capabilities",
      productivity: {
        title: "Productivity & Case Management",
        subtitle: "Streamline operations with fully expandable modules.",
        items: [
          { title: "Smart Case Files", description: "Cross-referencing, linking, and deep file attachments.", icon: Briefcase },
          { title: "Judicial Deadlines", description: "Automated countdown timers for appeals and objections.", icon: Clock },
          { title: "Confidential Vault", description: "Restricted access sections for sensitive case materials.", icon: Lock }
        ]
      },
      client: {
        title: "Client Experience & Collaboration",
        subtitle: "A dedicated portal to elevate your client relationships.",
        items: [
          { title: "Client Portal", description: "Secure access for requests, uploads, and viewing case status.", icon: Users },
          { title: "Financial Transparency", description: "Real-time balance tracking and expense summaries.", icon: LayoutDashboard },
          { title: "Appointment Booking", description: "Integrated scheduling for seamless consultations.", icon: Clock }
        ]
      },
      governance: {
        title: "Governance, Control & Security",
        subtitle: "Uncompromising security and audit trails.",
        items: [
          { title: "Approvals Center", description: "Centralized control for invoices, custody, and expenses.", icon: FileCheck },
          { title: "Audit Logs", description: "Timestamped tracking of every system action by user.", icon: ShieldCheck },
          { title: "Enterprise Security", description: "Private backend database with remote secure access.", icon: Server }
        ]
      },
      intelligence: {
        title: "Intelligence & Customization",
        subtitle: "Tailored for the modern legal professional.",
        items: [
          { title: "Legal Text Assistant", description: "Retrieve verified UAE statutory material instantly.", icon: BrainCircuit },
          { title: "Customizable UI", description: "12 themes with tailored fonts and color palettes.", icon: LayoutDashboard }
        ]
      },
      integration: {
        title: "Seamless Integrations",
        subtitle: "Connect with the tools you use daily.",
        items: [
          { title: "Communication", description: "WhatsApp Business & Microsoft 365 integration.", icon: MessageSquare },
          { title: "Workspace", description: "Full Google Workspace connectivity.", icon: LinkIcon }
        ]
      }
    },
    testimonials: {
      title: "Trusted by Industry Leaders",
      subtitle: "See why top-tier UAE firms are switching to LEXCORA.",
      items: [
        {
          quote: "The automated judicial deadline tracking has saved us countless hours. LEXCORA is a true game-changer for UAE litigation workflows.",
          author: "Sarah Al-Mansoori",
          role: "Senior Partner",
          firm: "Al-Mansoori & Associates"
        },
        {
          quote: "Finally, an ERP that handles bilingual documentation flawlessly. The Arabic interface is just as robust as the English one.",
          author: "James Sterling",
          role: "Managing Director",
          firm: "Sterling Legal Consultancy"
        },
        {
          quote: "Security is paramount for our high-net-worth clients. The private vault features give us the peace of mind we need.",
          author: "Dr. Ahmed Khalil",
          role: "Head of Dispute Resolution",
          firm: "Khalil International Law"
        }
      ]
    },
    caseStudies: {
      pageTitle: "Proven Results in the UAE Legal Sector",
      pageSubtitle: "Discover how leading firms are transforming their operations, efficiency, and client satisfaction with LEXCORA.",
      ctaTitle: "Ready to achieve similar results?",
      ctaButton: "Schedule Your Consultation",
      items: [
        {
          id: "1",
          firmName: "Al-Futtaim & Partners Legal Group",
          title: "Automating Litigation Workflows for 30% Efficiency Gains",
          challenge: "The firm struggled with manual deadline tracking across 500+ active litigation cases, leading to near-misses on appeal filings and excessive administrative overtime.",
          solution: "Implemented LEXCORA's Productivity Module with automated judicial deadline timers and smart case file linking.",
          metrics: [
            { value: "30%", label: "Reduction in Admin Time" },
            { value: "0", label: "Missed Deadlines in 12 Months" },
            { value: "100%", label: "Digitization of Case Files" }
          ],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600"
        },
        {
          id: "2",
          firmName: "Dubai Arbitration Counsel (DAC)",
          title: "Enhancing Client Transparency & Billing Accuracy",
          challenge: "High-net-worth clients demanded real-time updates on case expenses and balances, which the previous legacy system could not provide accurately.",
          solution: "Deployed the LEXCORA Client Portal and Financial Transparency module to give clients secure, real-time access to their financial standing.",
          metrics: [
            { value: "50%", label: "Faster Billing Cycle" },
            { value: "99.9%", label: "Invoice Accuracy" },
            { value: "4.8/5", label: "Client Satisfaction Score" }
          ],
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600"
        },
        {
          id: "3",
          firmName: "Sharjah Boutique Law",
          title: "Securing Sensitive Family Law Data",
          challenge: "Handling sensitive family law cases required a level of data security and access control that off-the-shelf software could not offer.",
          solution: "Utilized LEXCORA's Governance module with Granular Permissions and the Confidential Vault for restricted files.",
          metrics: [
            { value: "100%", label: "Audit Trail Coverage" },
            { value: "24/7", label: "Secure Remote Access" },
            { value: "ISO", label: "Compliant Security Standards" }
          ],
          image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600"
        }
      ]
    },
    pricing: {
      pageTitle: "Transparent Pricing for Modern Firms",
      pageSubtitle: "Choose the package that fits your practice scale and needs.",
      toggleMonthly: "Monthly",
      toggleAnnual: "Annually",
      saveLabel: "Get 2 Months Free",
      tiers: {
        starter: {
          name: "Starter Package",
          stars: 2,
          priceMonthly: "199",
          priceAnnually: "1,990",
          periodLabel: "AED / user",
          minUsers: "Minimum: 2 Users",
          features: [
            "Case and File Management (Unlimited)",
            "Client and Opponent Management",
            "Session Tracking + Automatic Reminders",
            "Consultation and Meeting Management",
            "Basic Invoicing + Basic Financial Reports",
            "Bilingual Interface (Arabic/English)",
            "Basic Permissions System",
            "20 GB Cloud Storage/user",
            "Technical Support (Email)",
            "Remote Training Session"
          ],
          cta: "Start Free Trial"
        },
        professional: {
          name: "Professional Package",
          stars: 3,
          priceMonthly: "349",
          priceAnnually: "3,490",
          periodLabel: "AED / user",
          minUsers: "Minimum: 4 Users",
          highlight: true,
          features: [
            "All Features from STARTER",
            "AI-powered intelligent legal assistant (200 queries)",
            "Advanced chart of accounts + reports",
            "Full HR management",
            "Asset management",
            "Team productivity monitoring",
            "Advanced permissions system",
            "100 GB storage/user",
            "Basic API (M365 / Google Workspace)",
            "Technical support (WhatsApp + email)",
            "Two remote training sessions"
          ],
          cta: "Go Professional"
        },
        enterprise: {
          name: "Enterprise Package",
          stars: 4,
          priceMonthly: "500+",
          priceAnnually: "Custom",
          periodLabel: "Starting from AED / user",
          minUsers: "Minimum: 20 Users",
          features: [
            "All Features from PROFESSIONAL",
            "Unlimited AI-powered intelligent assistant",
            "Unlimited storage",
            "Full API (WhatsApp Business + Google + M365)",
            "Custom reports on demand",
            "White-label (Logo & Identity)",
            "Customized Account Manager",
            "24/7 Technical Support",
            "Alerts for Assets/Contracts",
            "On-site Training (4 Sessions)",
            "Comprehensive Activity Log Tracking"
          ],
          cta: "Contact Sales"
        }
      },
      discounts: {
        title: "Volume Discounts",
        subtitle: "Scale your firm and save more.",
        tableHeadUser: "Number of Users",
        tableHeadDiscount: "Discount Percentage",
        items: [
          { range: "5-10 Users", discount: "5%" },
          { range: "11-20 Users", discount: "10%" },
          { range: "21-50 Users", discount: "15%" },
          { range: "51+ Users", discount: "20%" }
        ],
        note: "Note: Discounts apply to the monthly or annual price only."
      },
      referral: {
        title: "Referral Program",
        item1: "Get one free month for each law firm you refer that joins the system.",
        item2: "The referred firm receives a 15% discount on its first month."
      }
    },
    privacyPolicy: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: October 2023",
      intro: "At LEXCORA, we are committed to protecting the privacy and security of our clients' data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our ERP software and website. We operate in strict compliance with the UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data.",
      sections: [
        {
          heading: "1. Information We Collect",
          content: [
            "Personal Identification Information: Name, email address, phone number, and professional credentials when you register for an account.",
            "Case Data: Information related to legal cases, clients, and documents uploaded to the system. This data is processed solely for the purpose of providing the service.",
            "Usage Data: Information on how the service is accessed and used, including IP addresses, browser types, and log data."
          ]
        },
        {
          heading: "2. How We Use Your Information",
          content: [
            "To provide and maintain the LEXCORA ERP service.",
            "To manage your account, billing, and subscription.",
            "To notify you about changes to our service or judicial deadlines.",
            "To provide customer support and technical assistance.",
            "To detect, prevent, and address technical issues."
          ]
        },
        {
          heading: "3. Data Sovereignty & Security",
          content: [
            "We prioritize UAE data sovereignty. All critical client data is stored on secure, encrypted servers located within the United Arab Emirates or jurisdictions deemed to have adequate protection.",
            "We employ enterprise-grade encryption (AES-256) for data at rest and in transit.",
            "Access to your data is strictly limited to authorized personnel and is logged via our audit trail system."
          ]
        },
        {
          heading: "4. Disclosure of Information",
          content: [
            "We do not sell your personal data to third parties.",
            "We may disclose your personal data if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency in the UAE).",
            "We may share data with trusted third-party service providers (e.g., payment processors) solely for the purpose of operational functionality."
          ]
        },
        {
          heading: "5. Your Data Rights",
          content: [
            "Right to Access: You have the right to request copies of your personal data.",
            "Right to Rectification: You have the right to request correction of inaccurate information.",
            "Right to Erasure: You have the right to request deletion of your personal data, subject to legal retention requirements."
          ]
        }
      ],
      contact: {
        heading: "Contact Us",
        text: "If you have any questions about this Privacy Policy, please contact us:",
        email: "rased@almstkshf.com"
      }
    },
    trial: {
      pageTitle: "Start Your 14-Day Free Trial",
      steps: {
        1: "Personal Details",
        2: "Firm Information",
        3: "Confirmation"
      },
      form: {
        fullName: "Full Name",
        workEmail: "Work Email Address",
        phone: "Mobile Number",
        firmName: "Law Firm Name",
        firmSize: "Firm Size",
        sizes: ["Solo Practitioner", "2-10 Attorneys", "11-50 Attorneys", "50+ Attorneys"],
        next: "Next Step",
        back: "Back",
        submit: "Create Account"
      },
      success: {
        title: "Welcome to LEXCORA",
        subtitle: "Your account has been successfully created. We have sent a verification email to your inbox.",
        checklistTitle: "Your Onboarding Checklist",
        checklist: [
          "Verify your email address",
          "Complete your firm profile",
          "Invite team members",
          "Schedule onboarding call"
        ],
        dashboardButton: "Go to Dashboard"
      },
      testimonial: {
        quote: "The signup process was seamless. We had our entire case database migrated and running within 48 hours.",
        author: "Tariq Al-Hashimi, Managing Partner"
      }
    },
    
    
    insights: {
      title: "Legal Insights & Market Commentary",
      subtitle: "Stay ahead with updates from the UAE legal landscape.",
      demoTitle: "Experience Our Smart Assistant",
      demoPlaceholder: "Ask about UAE Labour Law (e.g., 'What is the gratuity calculation?')",
      demoButton: "Ask Assistant",
      articles: []
    },
    insightsPage: {
      pageTitle: "LEXCORA Intelligence Hub",
      pageSubtitle: "Expert analysis, regulatory updates, and practice management strategies for the modern UAE legal professional.",
      searchPlaceholder: "Search articles, topics, or keywords...",
      categories: ["All", "Regulatory", "Practice Management", "Legal Tech", "Market Analysis"],
      readMore: "Read Full Article",
      backButton: "Back to Insights Hub",
      items: []
    },
    chatbot: {
      title: "Rased Virtual Associate",
      placeholder: "Ask about UAE Law or Firm Management...",
      welcome: "Welcome. I am Rased, your Senior Virtual Associate. I am here to assist with queries regarding UAE Federal Law, judicial procedures, or the optimization of your firm's practice through LEXCORA. How may I serve your professional requirements today?",
      send: "Send",
      disclaimer: "Legal Disclaimer: My responses are for informational and operational guidance only and do not constitute formal legal advice."
    },
    footer: {
      about: "LEXCORA by ALMSTKSHF Co. The definitive ERP for UAE legal excellence.",
      contact: "Get in Touch",
      address: "Level 16, Alkhatem Building, Marya Island, Abu Dhabi, UAE",
      privacy: "Privacy Policy",
      compliance: "Compliance & Data Protection",
      rights: "© 2025 almstkshf co. All Rights Reserved.",
      newsletter: {
        title: "Stay Informed",
        description: "Subscribe to our newsletter for the latest legal tech insights and product updates.",
        placeholder: "Enter your work email",
        button: "Subscribe",
        success: "Thank you for subscribing!"
      }
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      features: "القدرات",
      insights: "مركز الرؤى",
      caseStudies: "قصص النجاح",
      contact: "اتصل بنا",
      portal: "دخول العملاء",
      demo: "اطلب عرضاً",
      freeTrial: "تجربة مجانية",
      pricing: "الأسعار"
    },
    hero: {
      title: "مستقبل المحاماة في الإمارات",
      subtitle: "ليكسكورا هو نظام تخطيط موارد المؤسسات الأول المصمم لمكاتب المحاماة الكبرى. دمج سلس للإنتاجية، والحوكمة، وتجربة العملاء.",
      ctaPrimary: "ابدأ تجربة مجانية",
      ctaCallback: "اطلب مكالمة",
      ctaSecondary: "استكشف الميزات",
      trustBadge: "موثوق به من كبار المستشارين القانونيين في دبي"
    },
    features: {
      sectionTitle: "قدرات على مستوى المؤسسات",
      productivity: {
        title: "الإنتاجية وإدارة القضايا",
        subtitle: "بسيط العمليات مع وحدات قابلة للتوسيع بالكامل.",
        items: [
          { title: "ملفات قضايا ذكية", description: "ربط مرجعي، وربط الملفات، ومرفقات عميقة.", icon: Briefcase },
          { title: "المواعيد القضائية", description: "مؤقتات عد تنازلي آلية للاستئناف والاعتراضات.", icon: Clock },
          { title: "خزنة سرية", description: "أقسام مقيدة الوصول لمواد القضايا الحساسة.", icon: Lock }
        ]
      },
      client: {
        title: "تجربة العملاء والتعاون",
        subtitle: "بوابة مخصصة للارتقاء بعلاقات عملائك.",
        items: [
          { title: "بوابة العملاء", description: "وصول آمن للطلبات، والتحميلات، وعرض حالة القضية.", icon: Users },
          { title: "الشفافية المالية", description: "تتبع الرصيد وملخصات المصاريف في الوقت الفعلي.", icon: LayoutDashboard },
          { title: "حجز المواعيد", description: "جدولة متكاملة لاستشارات سلسة.", icon: Clock }
        ]
      },
      governance: {
        title: "الحوكمة، والتحكم والأمان",
        subtitle: "أمان لا هوادة فيه وسجلات تدقيق.",
        items: [
          { title: "مركز الموافقات", description: "تحكم مركزي للفواتير، والعهد، والمصاريف.", icon: FileCheck },
          { title: "سجلات التدقيق", description: "تتبع زمني لكل إجراء في النظام حسب المستخدم.", icon: ShieldCheck },
          { title: "أمان المؤسسات", description: "قاعدة بيانات خلفية خاصة مع وصول آمن عن بعد.", icon: Server }
        ]
      },
      intelligence: {
        title: "الذكاء والتخصيص",
        subtitle: "مصممة للمحامي العصري.",
        items: [
          { title: "مساعد النصوص القانونية", description: "استرجاع المواد القانونية الإماراتية الموثقة فوراً.", icon: BrainCircuit },
          { title: "واجهة مستخدم قابلة للتخصيص", description: "١٢ سمة مع خطوط ولوحات ألوان مخصصة.", icon: LayoutDashboard }
        ]
      },
      integration: {
        title: "تكامل سلس",
        subtitle: "اتصل بالأدوات التي تستخدمها يومياً.",
        items: [
          { title: "الاتصالات", description: "تكامل واتساب للأعمال ومايكروسوفت ٣٦٥.", icon: MessageSquare },
          { title: "مساحة العمل", description: "اتصال كامل مع جوجل وورك سبيس.", icon: LinkIcon }
        ]
      }
    },
    testimonials: {
      title: "موثوق به من قادة الصناعة",
      subtitle: "شاهد لماذا تنتقل أفضل الشركات الإماراتية إلى ليكسكورا.",
      items: [
        {
          quote: "لقد وفر علينا تتبع المواعيد القضائية الآلي ساعات لا تحصى. ليكسكورا هو تغيير حقيقي لقواعد اللعبة في إجراءات التقاضي في الإمارات.",
          author: "سارة المنصوري",
          role: "شريك أول",
          firm: "المنصوري وشركاه"
        },
        {
          quote: "أخيراً، نظام تخطيط موارد يتعامل مع الوثائق ثنائية اللغة ببراعة. الواجهة العربية قوية تماماً مثل الإنجليزية.",
          author: "جيمس ستيرلينغ",
          role: "المدير العام",
          firm: "ستيرلينغ للاستشارات القانونية"
        },
        {
          quote: "الأمان أمر بالغ الأهمية لعملائنا من ذوي الثروات العالية. تمنحنا ميزات الخزنة الخاصة راحة البال التي نحتاجها.",
          author: "د. أحمد خليل",
          role: "رئيس تسوية المنازعات",
          firm: "خليل الدولية للمحاماة"
        }
      ]
    },
    caseStudies: {
      pageTitle: "نتائج مثبتة في القطاع القانوني الإماراتي",
      pageSubtitle: "اكتشف كيف تقوم الشركات الرائدة بتحويل عملياتها وكفاءتها ورضا عملائها مع ليكسكورا.",
      ctaTitle: "مستعد لتحقيق نتائج مماثلة؟",
      ctaButton: "احجز استشارتك",
      items: [
        {
          id: "1",
          firmName: "مجموعة الفطيم وشركاه القانونية",
          title: "أتمتة سير عمل التقاضي لتحقيق مكاسب كفاءة بنسبة ٣٠٪",
          challenge: "عانت الشركة من تتبع المواعيد النهائية يدوياً عبر أكثر من ٥٠٠ قضية نشطة، مما أدى إلى تفويت مواعيد الاستئناف والعمل الإضافي المفرط.",
          solution: "تم تطبيق وحدة الإنتاجية في ليكسكورا مع مؤقتات المواعيد القضائية الآلية وربط ملفات القضايا الذكي.",
          metrics: [
            { value: "٣٠٪", label: "تخفيض في الوقت الإداري" },
            { value: "٠", label: "مواعيد فائتة في ١٢ شهراً" },
            { value: "١٠٠٪", label: "رقمنة ملفات القضايا" }
          ],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600"
        },
        {
          id: "2",
          firmName: "مجلس التحكيم بدبي",
          title: "تعزيز شفافية العملاء ودقة الفواتير",
          challenge: "طالب العملاء من ذوي الثروات العالية بتحديثات فورية حول نفقات القضايا والأرصدة، وهو ما لم يتمكن النظام القديم من توفيره بدقة.",
          solution: "نشر بوابة عملاء ليكسكورا ووحدة الشفافية المالية لمنح العملاء وصولاً آمناً وفورياً لوضعهم المالي.",
          metrics: [
            { value: "٥٠٪", label: "دورة فواتير أسرع" },
            { value: "٩٩.٩٪", label: "دقة الفواتير" },
            { value: "٤.٨/٥", label: "درجة رضا العملاء" }
          ],
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600"
        },
        {
          id: "3",
          firmName: "الشارقة بوتيك للمحاماة",
          title: "تأمين بيانات قضايا الأسرة الحساسة",
          challenge: "تطلب التعامل مع قضايا الأسرة الحساسة مستوى من أمان البيانات والتحكم في الوصول لم تتمكن البرامج الجاهزة من تقديمه.",
          solution: "استخدام وحدة الحوكمة في ليكسكورا مع أذونات دقيقة والخزنة السرية للملفات المقيدة.",
          metrics: [
            { value: "١٠٠٪", label: "تغطية سجل التدقيق" },
            { value: "٢٤/٧", label: "وصول آمن عن بعد" },
            { value: "ISO", label: "معايير أمان متوافقة" }
          ],
          image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600"
        }
      ]
    },
    pricing: {
      pageTitle: "أسعار شفافة للشركات الحديثة",
      pageSubtitle: "اختر الباقة التي تناسب حجم واحتياجات ممارستك.",
      toggleMonthly: "شهرياً",
      toggleAnnual: "سنوياً",
      saveLabel: "احصل على شهرين مجاناً",
      tiers: {
        starter: {
          name: "باقة البداية",
          stars: 2,
          priceMonthly: "١٩٩",
          priceAnnually: "١,٩٩٠",
          periodLabel: "درهم / مستخدم",
          minUsers: "الحد الأدنى: ٢ مستخدمين",
          features: [
            "إدارة القضايا والملفات (غير محدود)",
            "إدارة العملاء والخصوم",
            "تتبع الجلسات + تذكيرات تلقائية",
            "إدارة الاستشارات والاجتماعات",
            "فواتير أساسية + تقارير مالية أساسية",
            "واجهة ثنائية اللغة (عربي/إنجليزي)",
            "نظام أذونات أساسي",
            "٢٠ جيجابايت تخزين سحابي/مستخدم",
            "دعم فني (بريد إلكتروني)",
            "جلسة تدريب عن بعد"
          ],
          cta: "ابدأ تجربة مجانية"
        },
        professional: {
          name: "الباقة الاحترافية",
          stars: 3,
          priceMonthly: "٣٤٩",
          priceAnnually: "٣,٤٩٠",
          periodLabel: "درهم / مستخدم",
          minUsers: "الحد الأدنى: ٤ مستخدمين",
          highlight: true,
          features: [
            "كل ميزات الباقة الأساسية",
            "مساعد قانوني ذكي (٢٠٠ استعلام)",
            "دليل حسابات متقدم + تقارير",
            "إدارة موارد بشرية كاملة",
            "إدارة الأصول",
            "مراقبة إنتاجية الفريق",
            "نظام أذونات متقدم",
            "١٠٠ جيجابايت تخزين/مستخدم",
            "API أساسي (M365 / Google Workspace)",
            "دعم فني (واتساب + بريد إلكتروني)",
            "جلستي تدريب عن بعد"
          ],
          cta: "اختر الاحترافية"
        },
        enterprise: {
          name: "باقة المؤسسات",
          stars: 4,
          priceMonthly: "٥٠٠+",
          priceAnnually: "مخصص",
          periodLabel: "يبدأ من درهم / مستخدم",
          minUsers: "الحد الأدنى: ٢٠ مستخدم",
          features: [
            "كل ميزات الباقة الاحترافية",
            "مساعد ذكي غير محدود",
            "تخزين غير محدود",
            "API كامل (WhatsApp Business + Google + M365)",
            "تقارير مخصصة عند الطلب",
            "هوية خاصة (الشعار والهوية)",
            "مدير حساب مخصص",
            "دعم فني ٢٤/٧",
            "تنبيهات للأصول/العقود",
            "تدريب في الموقع (٤ جلسات)",
            "تتبع سجل نشاط شامل"
          ],
          cta: "اتصل بالمبيعات"
        }
      },
      discounts: {
        title: "خصومات الحجم",
        subtitle: "وسع شركتك ووفر أكثر.",
        tableHeadUser: "عدد المستخدمين",
        tableHeadDiscount: "نسبة الخصم",
        items: [
          { range: "٥-١٠ مستخدمين", discount: "٥٪" },
          { range: "١١-٢٠ مستخدم", discount: "١٠٪" },
          { range: "٢١-٥٠ مستخدم", discount: "١٥٪" },
          { range: "٥١+ مستخدم", discount: "٢٠٪" }
        ],
        note: "ملاحظة: تطبق الخصومات على السعر الشهري أو السنوي فقط."
      },
      referral: {
        title: "برنامج الإحالة",
        item1: "احصل على شهر مجاني لكل مكتب محاماة تحيله وينضم للنظام.",
        item2: "يحصل المكتب المحال على خصم ١٥٪ في شهره الأول."
      }
    },
    privacyPolicy: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: أكتوبر ٢٠٢٣",
      intro: "في ليكسكورا، نلتزم بحماية خصوصية وأمان بيانات عملائنا. تحدد سياسة الخصوصية هذه كيفية جمع واستخدام والكشف عن وحماية معلوماتك عند استخدام برنامج ERP وموقعنا الإلكتروني. نعمل بامتثال صارم للمرسوم بقانون اتحادي رقم ٤٥ لسنة ٢٠٢١ بشأن حماية البيانات الشخصية.",
      sections: [
        {
          heading: "١. المعلومات التي نجمعها",
          content: [
            "معلومات التعريف الشخصية: الاسم وعنوان البريد الإلكتروني ورقم الهاتف وبيانات الاعتماد المهنية عند التسجيل للحصول على حساب.",
            "بيانات القضايا: المعلومات المتعلقة بالقضايا القانونية والعملاء والمستندات التي تم تحميلها على النظام. تتم معالجة هذه البيانات فقط لغرض تقديم الخدمة.",
            "بيانات الاستخدام: معلومات حول كيفية الوصول إلى الخدمة واستخدامها، بما في ذلك عناوين IP وأنواع المتصفحات وبيانات السجل."
          ]
        },
        {
          heading: "٢. كيف نستخدم معلوماتك",
          content: [
            "لتقديم وصيانة خدمة ليكسكورا ERP.",
            "لإدارة حسابك والفواتير والاشتراك.",
            "لإعلامك بالتغييرات في خدمتنا أو المواعيد القضائية.",
            "لتقديم دعم العملاء والمساعدة الفنية.",
            "للكشف عن المشكلات الفنية ومنعها ومعالجتها."
          ]
        },
        {
          heading: "٣. سيادة البيانات والأمان",
          content: [
            "نحن نعطي الأولوية لسيادة البيانات في الإمارات. يتم تخزين جميع بيانات العملاء الهامة على خوادم آمنة ومشفرة تقع داخل الإمارات العربية المتحدة أو ولايات قضائية تعتبر ذات حماية كافية.",
            "نستخدم تشفيراً على مستوى المؤسسات (AES-256) للبيانات في حالة السكون وأثناء النقل.",
            "يقتصر الوصول إلى بياناتك بشكل صارم على الموظفين المصرح لهم ويتم تسجيله عبر نظام سجل التدقيق الخاص بنا."
          ]
        },
        {
          heading: "٤. الكشف عن المعلومات",
          content: [
            "نحن لا نبيع بياناتك الشخصية لأطراف ثالثة.",
            "قد نكشف عن بياناتك الشخصية إذا كان ذلك مطلوباً بموجب القانون أو استجابة لطلبات صالحة من السلطات العامة (مثل محكمة أو وكالة حكومية في الإمارات).",
            "قد نشارك البيانات مع مزودي خدمة طرف ثالث موثوق بهم (مثل معالجي الدفع) فقط لغرض الوظائف التشغيلية."
          ]
        },
        {
          heading: "٥. حقوق بياناتك",
          content: [
            "حق الوصول: لديك الحق في طلب نسخ من بياناتك الشخصية.",
            "حق التصحيح: لديك الحق في طلب تصحيح المعلومات غير الدقيقة.",
            "حق المسح: لديك الحق في طلب حذف بياناتك الشخصية، مع مراعاة متطلبات الاحتفاظ القانونية."
          ]
        }
      ],
      contact: {
        heading: "اتصل بنا",
        text: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:",
        email: "rased@almstkshf.com"
      }
    },
    trial: {
      pageTitle: "ابدأ تجربتك المجانية لمدة ١٤ يوماً",
      steps: {
        1: "التفاصيل الشخصية",
        2: "معلومات الشركة",
        3: "التأكيد"
      },
      form: {
        fullName: "الاسم الكامل",
        workEmail: "عنوان بريد العمل",
        phone: "رقم الهاتف المتحرك",
        firmName: "اسم مكتب المحاماة",
        firmSize: "حجم المكتب",
        sizes: ["ممارس فردي", "٢-١٠ محامين", "١١-٥٠ محامياً", "٥٠+ محامياً"],
        next: "الخطوة التالية",
        back: "رجوع",
        submit: "إنشاء حساب"
      },
      success: {
        title: "مرحباً بك في ليكسكورا",
        subtitle: "تم إنشاء حسابك بنجاح. لقد أرسلنا بريداً إلكترونياً للتحقق إلى صندوق الوارد الخاص بك.",
        checklistTitle: "قائمة التحقق الخاصة بك",
        checklist: [
          "تحقق من عنوان بريدك الإلكتروني",
          "أكمل ملف تعريف الشركة",
          "قم بدعوة أعضاء الفريق",
          "احجز مكالمة تأهيل"
        ],
        dashboardButton: "الذهاب إلى لوحة التحكم"
      },
      testimonial: {
        quote: "كانت عملية التسجيل سلسة. تم ترحيل قاعدة بيانات القضايا بالكامل وتشغيلها في غضون ٤٨ ساعة.",
        author: "طارق الهاشمي، شريك إداري"
      }
    },
    
    
    insights: {
      title: "رؤى قانونية وتعليقات السوق",
      subtitle: "ابق في المقدمة مع تحديثات المشهد القانوني في الإمارات.",
      demoTitle: "جرب مساعدنا الذكي",
      demoPlaceholder: "اسأل عن قانون العمل الإماراتي (مثلاً: 'ما هو حساب مكافأة نهاية الخدمة؟')",
      demoButton: "اسأل المساعد",
      articles: []
    },
    insightsPage: {
      pageTitle: "مركز ذكاء ليكسكورا",
      pageSubtitle: "تحليل الخبراء، والتحديثات التنظيمية، واستراتيجيات إدارة الممارسة للمحامي الإماراتي الحديث.",
      searchPlaceholder: "ابحث عن مقالات، مواضيع، أو كلمات مفتاحية...",
      categories: ["الكل", "تنظيمي", "إدارة الممارسة", "التكنولوجيا القانونية", "تحليل السوق"],
      readMore: "اقرأ المقال كاملاً",
      backButton: "العودة لمركز الرؤى",
      items: []
    },
    chatbot: {
      title: "راصد - المساعد الافتراضي",
      placeholder: "اسأل عن القانون الإماراتي أو إدارة المكتب...",
      welcome: "مرحباً بكم. أنا 'راصد'، مساعدكم الافتراضي الأول. أنا هنا لمساعدتكم في الاستفسارات المتعلقة بالقانون الاتحادي الإماراتي، أو الإجراءات القضائية، أو تحسين ممارسة مكتبكم عبر نظام ليكسكورا. كيف يمكنني تلبية متطلباتكم المهنية اليوم؟",
      send: "إرسال",
      disclaimer: "تنويه قانوني: ردودي هي للإرشاد المعلوماتي والتشغيلي فقط ولا تشكل مشورة قانونية رسمية."
    },
    footer: {
      about: "ليكسكورا من شركة المستكشف. نظام تخطيط الموارد الأمثل للتميز القانوني في الإمارات.",
      contact: "تواصل معنا",
      address: "الطابق ١٦، مبنى الخاتم، جزيرة المارية، أبوظبي، الإمارات",
      privacy: "سياسة الخصوصية",
      compliance: "الامتثال وحماية البيانات",
      rights: "© ٢٠٢٥ شركة المستكشف. جميع الحقوق محفوظة.",
      newsletter: {
        title: "Stay Informed",
        description: "Subscribe to our newsletter for the latest legal tech insights and product updates.",
        placeholder: "Enter your work email",
        button: "اشتراك",
        success: "شكراً لاشتراكك!"
      }
    }
  }
};