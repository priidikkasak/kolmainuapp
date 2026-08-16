"use client";

import { useState } from "react";
import { Info, InfoRow, PageTitle, Section } from "@/components/primitives";

const presets = [5, 10, 25, 50, 100] as const;
type Preset = (typeof presets)[number];
type Selection = Preset | "other";

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
            <InfoRow label="Konto" variant="account">
              {iban}
            </InfoRow>
          ) : null}
          <InfoRow label="Saaja">{owner}</InfoRow>
          <InfoRow label="Selgitus">{reference}</InfoRow>
        </Info>
      </Section>
    </>
  );
}
