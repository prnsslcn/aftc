import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "아세아 비행교육원 | Asea Flight Training Center",
  description:
    "아세아 비행교육원 — 예비 조종사 양성부터 항공사 입사까지. 해외 비행유학 사전교육 전문기관.",
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
      <body className="min-h-[100dvh] flex flex-col bg-white text-black font-sans overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration='manual';window.scrollTo(0,0);` }} />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
