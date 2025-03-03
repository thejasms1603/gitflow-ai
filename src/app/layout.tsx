import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { Providers } from "./Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

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
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
        {/* <Navbar/> */}
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors/>
        </Providers>
      </body>
    </html>
  );
}
