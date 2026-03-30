import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { CursorMount } from "@/components/CursorMount";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Micah Mei — Portfolio",
  description:
    "Computer Science & Ivey Business — Western University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${GeistMono.variable}`}
      style={{ backgroundColor: "#000000" }}
    >
      <body
        className="font-sans min-h-screen antialiased"
        style={{ backgroundColor: "#000000", color: "#e0e0e0" }}
      >
        <CursorMount />
        {children}
      </body>
    </html>
  );
}
