import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/ui/ui/header"; //need to fix this

export const metadata: Metadata = {
  title: "Quizzly",
  description: "Generate quizzes and study faster using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="Quizzly" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <SessionProvider>
        <body className={"dark"}>
          <Header />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
