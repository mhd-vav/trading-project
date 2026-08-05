// src/lib/nav.ts
// src/lib/nav.ts
export const PUBLIC_NAV = [
  { href: "/markets", label: "بازارها" },
  { href: "/news", label: "اخبار" },
  { href: "/ai-desks", label: "میزهای هوش مصنوعی" },
  { href: "/calendar", label: "تقویم بازار" },
  { href: "/academy", label: "آکادمی" },
  { href: "/how-it-works", label: "نحوه کار" },
  { href: "/pricing", label: "تعرفه" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/markets", label: "ترمینال بازار" },
    { href: "/news", label: "اخبار بازار" },
    { href: "/ai-desks", label: "میزهای هوش مصنوعی" },
    { href: "/calendar", label: "تقویم بازار" },
    { href: "/academy", label: "آکادمی معامله‌گری" },
    { href: "/blog", label: "بلاگ و تحلیل آموزشی" },
    { href: "/how-it-works", label: "نحوه کار پلتفرم" },
    { href: "/pricing", label: "تعرفه اشتراک" },
  ],
  company: [
    { href: "/about", label: "درباره مافید" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/faq", label: "سوالات متداول" },
    { href: "/newsletter", label: "خبرنامه" },
  ],
  legal: [
    { href: "/terms", label: "قوانین و مقررات" },
    { href: "/privacy", label: "حریم خصوصی" },
  ],
} as const;
