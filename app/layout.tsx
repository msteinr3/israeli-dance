import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { commonStyles } from "@/styles/common";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Israeli Dance",
  description: "A place to explore Israeli dancing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <nav style={commonStyles.nav}>
          <div style={commonStyles.logo}>Israeli Dance</div>

          <div style={commonStyles.links}>
            <Link href="/" style={commonStyles.link}>
              Home
            </Link>

            <Link href="/dances" style={commonStyles.link}>
              Dances
            </Link>

            <Link href="/places" style={commonStyles.link}>
              Places
            </Link>

            <Link href="/about" style={commonStyles.link}>
              About
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
