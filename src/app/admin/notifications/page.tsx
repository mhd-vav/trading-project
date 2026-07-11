export const metadata = { title: "ارسال اعلان" };

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">اعلان‌ها</h1>
        <p className="mt-1 text-sm text-muted">ارسال اعلان به کاربران</p>
      </div>

      <form className="space-y-5 rounded-xl border border-border bg-surface p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">عنوان</label>
          <input type="text" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none" placeholder="عنوان اعلان" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">پیام</label>
          <textarea rows={4} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none" placeholder="متن اعلان" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">کانال</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" defaultChecked /> درون‌برنامه‌ای</label>
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" /> ایمیل</label>
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" /> پیامک</label>
          </div>
        </div>
        <button type="button" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover">ارسال</button>
      </form>
    </div>
  );
}
