export const PUBLIC_NAV = [
  { href: "/how-it-works", label: "نحوه کار" },
  { href: "/pricing", label: "تعرفه" },
  { href: "/sample-analysis", label: "نمونه تحلیل" },
  { href: "/request-analysis", label: "درخواست تحلیل" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/contact", label: "تماس" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/how-it-works", label: "نحوه کار پلتفرم" },
    { href: "/pricing", label: "تعرفه اشتراک" },
    { href: "/sample-analysis", label: "نمونه تحلیل" },
    { href: "/request-analysis", label: "درخواست تحلیل اختصاصی" },
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
