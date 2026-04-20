import type { Metadata } from "next";
import HeroExpand from "./HeroExpand";

export const metadata: Metadata = {
  title: "Hero Expand Test",
  robots: "noindex",
};

export default function Test1Page() {
  return <HeroExpand />;
}
