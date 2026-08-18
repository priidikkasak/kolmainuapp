"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Photo = { src: string; alt: string };
type Group = { title: string; count: number; photos: Photo[] };

export function GalleryClient({ groups }: { groups: Group[] }) {
  const flat = groups.flatMap((g) => g.photos);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + flat.length) % flat.length)),
    [flat.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % flat.length)),
    [flat.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, prev, next]);

  let flatOffset = 0;

  return (
    <>
      <div className="flex flex-col gap-8">
        {groups.map((group) => {
          const startIndex = flatOffset;
          flatOffset += group.photos.length;
          return (
            <section key={group.title || "feed"}>
              {group.title ? (
                <div className="text-[17px] font-semibold text-ink tracking-[-0.02em] mb-3">
                  {group.title}
                  <span className="ml-2 text-[13px] font-medium text-ink-3">
                    {group.count}
                  </span>
                </div>
              ) : null}
              <div className="grid grid-cols-3 gap-1.5">
                {group.photos.map((p, i) => {
                  const absIndex = startIndex + i;
                  return (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => setOpenIndex(absIndex)}
                      className="relative aspect-square rounded-[10px] overflow-hidden bg-surface transition-transform active:scale-[0.97]"
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        sizes="(max-width: 520px) 33vw, 160px"
                        className="object-cover"
                        loading={absIndex < 3 ? "eager" : "lazy"}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {openIndex !== null ? (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Sulge"
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
            style={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Prev */}
          {flat.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Eelmine"
              className="absolute left-2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : null}

          {/* Next */}
          {flat.length > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Järgmine"
              className="absolute right-2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          ) : null}

          {/* Counter */}
          <div
            className="absolute z-10 text-white/80 text-[13px] font-medium tabular-nums"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
          >
            {openIndex + 1} / {flat.length}
          </div>

          {/* Image */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={flat[openIndex].src}
              src={flat[openIndex].src}
              alt={flat[openIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
