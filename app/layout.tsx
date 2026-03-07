import type { Metadata } from "next";
import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";
import config from "./config";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});
export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${beVietnamPro.variable} ${spaceGrotesk.variable} font-body antialiased relative bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
