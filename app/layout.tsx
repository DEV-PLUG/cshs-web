import type { Metadata } from "next";
import "./globals.css";
import { SWRProvider } from "@libs/client/swr-provider";
import Notification from "@components/notification";
import Providers from "./providers";
import MobileLoading from "@components/menu/mobile-loading";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <SpeedInsights/>
      <Providers>
        <SWRProvider>
          <body>
            {children}
            <MobileLoading/>
            <Notification/>
          </body>
        </SWRProvider>
      </Providers>
    </html>
  );
}
