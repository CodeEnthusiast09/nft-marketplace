import type { Metadata } from "next";
import { plusJakartaSans } from "./font";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { Providers } from "@/components/provider/provider";
import "@rainbow-me/rainbowkit/styles.css";
import { Navbar } from "./_components/navbar";

export const metadata: Metadata = {
  title: "Hex Marketplace",
  description: "Buy and sell NFTs with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>
        <Providers>
          <ToastProvider />
          <Navbar />
          <main className="min-h-screen overflow-hidden">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
