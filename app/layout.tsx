import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "./page";

export const metadata: Metadata = {
  title: "Flexemarketplace - A wholesale marketplace for retailers and suppliers",
  description: "Flexemarketplace is a wholesale marketplace that connects retailers and suppliers, providing a platform for seamless transactions and business growth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body><AuthGuard>{children}</AuthGuard></body>
    </html>
  );
}