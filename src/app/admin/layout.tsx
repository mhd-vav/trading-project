import Link from "next/link";
import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "پنل مدیریت",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">MAFID</span>
              <span className="rounded bg-warning/10 px-2 py-0.5 text-xs text-warning">مدیریت</span>
            </Link>
          </div>
          <Link href="/" className="text-sm text-muted hover:text-foreground">بازگشت به سایت</Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <AdminSidebar />
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
