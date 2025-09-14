import type { Metadata } from "next";
// Temporarily disable external Google font fetch (was causing ETIMEDOUT in CI build)
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../shared/context/AuthProvider";
import { OfflineBanner } from "../shared/ui/OfflineBanner";
import AppHeader from "../shared/ui/AppHeader";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "AltruiShare",
  description: "AltruiShare – Unified impact & surplus mobilization platform",
  icons: {
    icon: "/AltruiShare.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen flex flex-col bg-gradient-to-br from-brand-navy/10 via-brand-violet/10 to-brand-coral/10`}>
        <link rel="icon" href="/AltruiShare.ico" />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-indigo text-white px-3 py-2 rounded-md text-sm z-50">Skip to content</a>
        <AuthProvider>
          <OfflineBanner />
          <AppHeader />
          <div aria-live="polite" aria-atomic="true" className="sr-only" id="global-status-region" />
          <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 focus:outline-none">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
