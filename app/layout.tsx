import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { KakaoMapScript } from "@/components/KakaoMapScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "에너지 대시보드",
  description: "에너지 충전소 관리 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <KakaoMapScript />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
