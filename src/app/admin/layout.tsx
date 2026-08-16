import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sisuhaldus",
  robots: { index: false, follow: false },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[640px] px-5 pb-24 pt-[calc(env(safe-area-inset-top)+20px)]">
      {children}
    </div>
  );
}
