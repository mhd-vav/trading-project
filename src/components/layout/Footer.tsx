import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="col-span-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">MAFID</span>
            <span className="text-sm text-muted">هوش بازار</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            پلتفرم هوشمندی بازار با تحلیل نمادمحور، ساختاریافته و قابل‌فهم.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">محصول</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.product.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">شرکت</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">قانونی</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} MAFID. این پلتفرم ارائه‌دهنده تحلیل و هوشمندی بازار است، نه مشاوره مالی مستقیم.
          </p>
        </div>
      </div>
    </footer>
  );
}
