import type { Metadata } from "next";
import "./globals.css";
import "./fonts/pretendard.css";
import { SWRProvider } from "@libs/client/swr-provider";
import Notification from "@components/notification";
import Providers from "./providers";
import MobileLoading from "@components/menu/mobile-loading";
import localFont from 'next/font/local'

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
      <Providers>
        <SWRProvider>
          <body className={`${pretendard.className} font-pretendard`}>
            {children}
            <MobileLoading/>
            <Notification/>
          </body>
        </SWRProvider>
      </Providers>
    </html>
  );
}
