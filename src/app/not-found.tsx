import Link from "next/link";
import { PageTitle } from "@/components/primitives";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[520px] px-5 py-10">
      <PageTitle title="Lehte ei leitud" subtitle="Otsitud lehte pole olemas või on see teisaldatud." />
      <Link
        href="/"
        prefetch
        className="inline-flex items-center gap-2 px-5 py-[14px] bg-surface rounded-[14px] text-[15px] font-semibold text-ink tracking-tight transition-transform active:scale-[0.99]"
      >
        ← Avalehele
      </Link>
    </div>
  );
}
