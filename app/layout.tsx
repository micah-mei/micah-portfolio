import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { CursorMount } from "@/components/CursorMount";
import "./globals.css";

const TAB_ICON =
  "/tab_logo/" +
  encodeURIComponent("A_minimalist,_high-end_202604021710.png");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Micah Mei — Portfolio",
  description:
    "Computer Science & Ivey Business — Western University.",
  icons: {
    icon: [{ url: TAB_ICON, type: "image/png" }],
    apple: [{ url: TAB_ICON, type: "image/png" }],
    shortcut: [{ url: TAB_ICON, type: "image/png" }],
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
