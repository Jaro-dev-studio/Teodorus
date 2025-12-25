import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TriggerTs | Luxury Meets Internet Money",
  description: "Ironic, funny, intelligently controversial t-shirts for the discerning internet native. Quiet luxury with a smirk.",
  keywords: ["t-shirts", "ironic", "luxury streetwear", "internet culture", "meme fashion"],
  openGraph: {
    title: "TriggerTs | Luxury Meets Internet Money",
    description: "Ironic, funny, intelligently controversial t-shirts for the discerning internet native.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} h-full bg-background font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
