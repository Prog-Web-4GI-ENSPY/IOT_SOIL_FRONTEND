import type { Metadata } from "next";
import "./globals.css";
import { TranslationProvider } from "@/providers/TranslationProvider";

export const metadata: Metadata = {
  title: "Smart Agro",
  description: "The soil speaks. We listen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}