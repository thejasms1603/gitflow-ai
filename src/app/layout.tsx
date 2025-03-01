import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { Providers } from "./Providers";

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
          <TRPCReactProvider>{children}</TRPCReactProvider>
          </Providers>
        </body>
      </html>
  );
}
