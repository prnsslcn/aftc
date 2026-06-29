import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const SITE_URL = "https://www.abc-fly.com";
const SITE_NAME = "ABC 비행교육원";
const SITE_DESCRIPTION =
  "ABC 비행교육원 — 예비 조종사 양성부터 항공사 입사까지. 해외 비행유학 사전교육·FTD 실습·항공사 채용 통합 솔루션.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ABC Flight Training Center`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "ABC 비행교육원",
    "ABC Flight Training Center",
    "비행 유학",
    "비행유학 사전교육",
    "Ground School",
    "FTD",
    "C172",
    "A320",
    "B737",
    "Embry-Riddle",
    "Embry-Riddle Aeronautical University",
    "ERAU",
    "조종사 양성",
    "항공사 입사 교육",
    "APP",
    "UPP",
    "PPL",
    "항공운항학과",
    "조종사",
    "비행학교",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ABC Flight Training Center`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero-aircraft.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — 격납고 항공기`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ABC Flight Training Center`,
    description: SITE_DESCRIPTION,
    images: ["/images/hero-aircraft.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --font-pretendard: 'Pretendard', system-ui, sans-serif; }`,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-[#fafaf8] text-black font-sans">
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration='manual';window.scrollTo(0,0);` }} />
        <SmoothScrollProvider>
          <PageTransition navbar={<Navbar />}>{children}</PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
