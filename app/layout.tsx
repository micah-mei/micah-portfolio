import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { CursorMount } from "@/components/CursorMount";
import "./globals.css";

const TAB_LOGO = "/tab-logo.png?v=adobe-express-2";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Micah Mei",
  description:
    "Computer Science & Ivey Business — Western University.",
  icons: {
    icon: [{ url: TAB_LOGO, type: "image/png", sizes: "256x256" }],
    apple: [{ url: TAB_LOGO, type: "image/png", sizes: "256x256" }],
    shortcut: [{ url: TAB_LOGO, type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable}`}>
      <body className={inter.className}>
        <CursorMount />
        {children}
      </body>
    </html>
  );
}
