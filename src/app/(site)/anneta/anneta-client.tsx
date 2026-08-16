"use client";

import { useState } from "react";
import {
  PageTitle,
  Section,
  Info,
  InfoRow,
} from "@/components/primitives";

const presets = [5, 10, 25, 50, 100] as const;
type Preset = (typeof presets)[number];
type Selection = Preset | "other";

export default function AnnetaClient() {
  const [selected, setSelected] = useState<Selection>(10);
  const [customAmount, setCustomAmount] = useState<number | null>(null);

  const displayAmount =
    selected === "other" && customAmount != null ? customAmount : selected;

  const handleOther = () => {
    const value = window.prompt("Sisesta summa eurodes:");
    if (value && !isNaN(Number(value))) {
      setCustomAmount(Number(value));
      setSelected("other");
    }
  };

  const handleDonate = () => {
    window.alert("Prototüüp. Makseintegratsioon tuleb järgmises versioonis.");
  };

  return (
    <>
      <PageTitle title="Anneta" subtitle="Toeta koguduse tööd. Iga panus loeb." />

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
            {selected === "other" && customAmount != null
              ? `${customAmount} €`
              : "Muu"}
          </button>
        </div>
      </Section>

      <button
        type="button"
        onClick={handleDonate}
        className="mt-6 w-full bg-ink text-white rounded-[14px] py-4 text-[16px] font-semibold tracking-tight transition-transform active:scale-[0.99]"
      >
        Anneta <span>{displayAmount} €</span>
      </button>

      <Section label="Ülekanne">
        <Info>
          <InfoRow label="Konto" variant="account">
            EE23 1010 2200 4587 5006
          </InfoRow>
          <InfoRow label="Saaja">Kolmainu kogudus</InfoRow>
          <InfoRow label="Selgitus">Annetus</InfoRow>
        </Info>
      </Section>
    </>
  );
}
