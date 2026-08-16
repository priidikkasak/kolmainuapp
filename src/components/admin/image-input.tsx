"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { inputClass } from "./ui";

export function ImageInput({
  name,
  defaultValue,
  required,
}: {
  name: string;
  defaultValue: string;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = (file: File) => {
    setError(null);
    startTransition(async () => {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Üleslaadimine ebaõnnestus.");
        return;
      }
      setUrl(data.url);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        name={name}
        value={url}
        required={required}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="/images/pilt.jpg või https://…"
        className={inputClass}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="rounded-[10px] bg-bg px-3.5 py-2 text-[13px] font-medium text-ink-2 disabled:opacity-50"
        >
          {pending ? "Laadin…" : "Lae pilt üles"}
        </button>
        {url ? (
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[8px] bg-bg">
            <Image src={url} alt="" fill sizes="44px" className="object-cover" unoptimized />
          </span>
        ) : null}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {error ? <p className="text-[12px] text-[#8a1c1c]">{error}</p> : null}
    </div>
  );
}
