import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Chewy } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { StackedLayout } from "@/components/blocks/stacked-layout";
import { ThemeProvider } from "next-themes";
import { RxDBProvider } from "@/providers/RxDBProvider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalyticsProvider } from "@/providers/GoogleAnalytics";
import { ClarityAnalytics } from "@/providers/ClarityAnalytics";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Chewy({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['400']
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DailyHabit - Build Better Habits Daily",
  description: "Track your daily habits and build lasting positive changes with our simple and intuitive habit tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, poppins.variable)}
    >
      <head>
        <GoogleAnalyticsProvider />
        <ClarityAnalytics />
      </head>
      <body className="min-h-full flex flex-col">
        <RxDBProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <StackedLayout>{children}</StackedLayout>
            <Toaster />
          </ThemeProvider>
        </RxDBProvider>
      </body>
    </html>
  );
}
