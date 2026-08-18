import Link from "next/link";
import Image from "next/image";

export function BentoTile({
  href,
  image,
  label,
  priority = false,
}: {
  href: string;
  image: string;
  label: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch
      className="relative isolate aspect-square rounded-[22px] overflow-hidden bg-surface transition-transform active:scale-[0.98]"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 520px) 50vw, 260px"
        className="object-cover"
        priority={priority}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-black/[.28] to-black/[.72] via-[65%]" />
      <div className="absolute left-4 right-4 bottom-3.5 z-[2] text-white">
        <div
          className="text-[17px] font-semibold tracking-tight leading-tight"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.3)" }}
        >
          {label}
        </div>
      </div>
    </Link>
  );
}
