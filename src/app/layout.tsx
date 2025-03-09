import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { Providers } from "./Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gitflow AI",
  description:
    "GitFlow AI is an AI-powered GitHub tool that enhances developer workflows with smart automation and code insights.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} min-h-screen bg-background font-sans antialiased`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div>
            <Navbar />
            <main className="flex-1">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </main>
            <Toaster richColors />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
