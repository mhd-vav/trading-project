// src/app/app/ai-desks/page.tsx
import AnalysisDesk from "@/components/ai/AnalysisDesk";

export const metadata = { title: "میزهای هوش مصنوعی" };

export default function AiDesksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">میزهای هوش مصنوعی</h1>
        <p className="mt-1 text-sm text-muted">
          تحلیل چنددیدگاهی با نمایش شفاف نتیجه، اختلاف و محدودیت‌ها
        </p>
      </div>
      <AnalysisDesk />
    </div>
  );
}
