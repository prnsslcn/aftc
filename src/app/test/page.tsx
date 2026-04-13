import type { Metadata } from "next";
import JetonDemo from "./JetonDemo";

export const metadata: Metadata = {
  title: "Lenis Scroll Test — Jeton Reference",
  robots: "noindex",
};

export default function TestPage() {
  return <JetonDemo />;
}
