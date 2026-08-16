import type { Metadata } from "next";
import AnnetaClient from "./anneta-client";

export const metadata: Metadata = {
  title: "Anneta",
};

export default function AnnetaPage() {
  return <AnnetaClient />;
}
