import Link from "next/link";
import MemberSidebar from "@/components/layout/MemberSidebar";
import MemberTopbar from "@/components/layout/MemberTopbar";

export const metadata = {
  title: "پنل کاربری",
};

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/app/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">MAFID</span>
              <span className="hidden text-sm text-muted sm:inline">پنل کاربری</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted hover:text-foreground">بازگشت به سایت</Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-foreground">
              م
            </div>
          </div>
        </div>
      </header>

      <MemberTopbar />

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <MemberSidebar />
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
