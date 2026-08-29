import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PlaceholderNotice } from "@/components/layout/placeholder-notice";

export const metadata: Metadata = {
  title: {
    default: "Personal Engineering Lab (placeholder)",
    template: "%s | Personal Engineering Lab (placeholder)",
  },
  description:
    "Work-in-progress personal engineering lab shell. All profile, experience, and project content is a placeholder pending owner approval.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full font-sans antialiased">
      <body className="flex min-h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <SiteHeader />
        <PlaceholderNotice />
        <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
