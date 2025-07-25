import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/app-context";


export const metadata: Metadata = {
  title: "PatchWise",
  description: "Intelligent Vulnerability Management and Patch Prioritization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
