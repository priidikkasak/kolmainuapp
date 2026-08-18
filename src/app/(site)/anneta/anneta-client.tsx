"use client";

import { useState } from "react";
import { Info, InfoRow, PageTitle, Section } from "@/components/primitives";

const presets = [5, 10, 25, 50, 100] as const;
type Preset = (typeof presets)[number];
type Selection = Preset | "other";


function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {done ? (
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      ) : (
        <>
          <rect x="9" y="9" width="11" height="11" rx="2.5" />
          <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A2.5 2.5 0 0 0 4 5.5v6A2.5 2.5 0 0 0 6.5 14" />
        </>
      )}
    </svg>
  );
}

/** Row value with its own copy button - manual transfers are typed by hand. */
function CopyRow({
  label,
  value,
  copyText,
  variant,
}: {
  label: string;
  value: string;
  copyText?: string;
  variant?: "account";
}) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? value);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      setDone(false);
    }
  };

  return (
    <InfoRow label={label} variant={variant}>
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0">{value}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={done ? `${label} kopeeritud` : `Kopeeri ${label.toLowerCase()}`}
          className={`-my-2 -mr-1.5 shrink-0 rounded-[10px] p-2 transition-colors active:scale-95 ${
            done ? "text-ink" : "text-ink-3"
          }`}
        >
          <CopyIcon done={done} />
        </button>
      </div>
    </InfoRow>
  );
}

export default function AnnetaClient({
  title,
  subtitle,
  iban,
  owner,
  reference,
}: {
  title: string;
  subtitle: string;
  iban: string | null;
  owner: string;
  reference: string;
}) {
  const [selected, setSelected] = useState<Selection>(10);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const displayAmount =
    selected === "other" && customAmount != null ? customAmount : selected;

  const handleOther = () => {
    const value = window.prompt("Sisesta summa eurodes:");
    if (value && !isNaN(Number(value))) {
      setCustomAmount(Number(value));
      setSelected("other");
    }
  };

  const copyIban = async () => {
    if (!iban) return;
    try {
      await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <PageTitle title={title} subtitle={subtitle} />

      <Section label="Summa">
        <div className="grid grid-cols-3 gap-2">
          {presets.map((amount) => {
            const isActive = selected === amount;
            return (
              <button
                key={amount}
                type="button"
                onClick={() => setSelected(amount)}
                className={`bg-surface rounded-[14px] p-5 text-[16px] font-semibold text-ink tracking-tight transition-all active:scale-[0.98] ${
                  isActive ? "ring-2 ring-ink ring-inset" : "ring-0"
                }`}
              >
                {amount} €
              </button>
            );
          })}
          <button
            type="button"
            onClick={handleOther}
            className={`bg-surface rounded-[14px] p-5 text-[16px] font-medium text-ink-2 tracking-tight transition-all active:scale-[0.98] ${
              selected === "other" ? "ring-2 ring-ink ring-inset" : "ring-0"
            }`}
          >
            {selected === "other" && customAmount != null ? `${customAmount} €` : "Muu"}
          </button>
        </div>
      </Section>

      {iban ? (
        <button
          type="button"
          onClick={copyIban}
          className="mt-6 w-full bg-ink text-white rounded-[14px] py-4 text-[16px] font-semibold tracking-tight transition-transform active:scale-[0.99]"
        >
          {copied ? "Konto kopeeritud" : `Kopeeri konto · ${displayAmount} €`}
        </button>
      ) : null}

      <Section label="Ülekanne">
        <Info>
          {iban ? (
            <CopyRow label="Konto" value={iban} copyText={iban.replace(/\s/g, "")} variant="account" />
          ) : null}
          <CopyRow label="Saaja" value={owner} />
          <CopyRow label="Selgitus" value={reference} />
        </Info>
      </Section>
    </>
  );
}
