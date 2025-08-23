"use client";
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// export const metadata: Metadata = {
//   title: "Hijab Collection - Premium Islamic Fashion",
//   description:
//     "Discover our exquisite collection of premium hijabs crafted with the finest materials for the modern Muslim woman.",
//   generator: "v0.app",
// };

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Toaster/>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
