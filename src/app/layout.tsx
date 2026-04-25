import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_KR, Wendy_One } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const wendyOne = Wendy_One({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "komki — 창업자를 위한 비즈니스 레터",
  description:
    "매주 화요일, 창업자가 놓치면 안 되는 비즈니스 인사이트를 골라서 보내드립니다. 복잡한 정보를 단 5분에.",
  openGraph: {
    title: "komki — 창업자를 위한 비즈니스 레터",
    description: "매주 화요일, 창업자에게 필요한 것들만 골라서",
    url: "https://komki.co.kr",
    siteName: "komki",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "komki — 창업자를 위한 비즈니스 레터",
    description: "매주 화요일, 창업자에게 필요한 것들만 골라서",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${notoSansKR.variable} ${wendyOne.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
