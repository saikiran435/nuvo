import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Baloo_2, Nunito } from "next/font/google";
import { ChikuSprite } from "@/components/ChikuSprite";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Nuvo Circle",
  description: "A Green Passport for children. Learn, do, and earn Green Credits.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ChikuSprite />
        {children}
      </body>
    </html>
  );
}
