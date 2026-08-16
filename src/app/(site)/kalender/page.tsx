import type { Metadata } from "next";
import KalenderClient from "./kalender-client";

export const metadata: Metadata = {
  title: "Kalender",
};

export default function KalenderPage() {
  return <KalenderClient />;
}
