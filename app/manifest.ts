import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "전자 활동 승인서",
    short_name: "전자활승",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "/app-icon/ios/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/app-icon/ios/512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/app-icon/ios/192.png",
        sizes: "192x192",
        purpose: "maskable",
        type: "image/png",
      },
      {
        src: "/app-icon/ios/512.png",
        sizes: "512x512",
        purpose: "maskable",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/app-icon/ios/512.png",
        sizes: "1280x720",
        type: "image/png"
      },
      {
        src: "/app-icon/ios/512.png",
        sizes: "1280x720",
        type: "image/png"
      }
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "ko-KR",
    start_url: "/",
  };
}