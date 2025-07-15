import type { Metadata } from "next";
import "./globals.css";
import "./fonts/pretendard.css";
import { SWRProvider } from "@libs/client/swr-provider";
import Notification from "@components/notification";
import Providers from "./providers";
import MobileLoading from "@components/menu/mobile-loading";
import { SpeedInsights } from "@vercel/speed-insights/next"
import localFont from 'next/font/local'
import { ThemeProvider } from "@libs/client/theme-context"

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <SpeedInsights/>
      <ThemeProvider>
        <Providers>
          <SWRProvider>
            <body className={`${pretendard.className} font-pretendard bg-white dark:bg-gray-900 transition-colors duration-300`}>
              {children}
              <MobileLoading/>
              <Notification/>
            </body>
          </SWRProvider>
        </Providers>
      </ThemeProvider>
    </html>
  );
}
