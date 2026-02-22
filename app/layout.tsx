import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "./page";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Flexemarketplace - A wholesale marketplace for retailers and suppliers",
  description: "...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}