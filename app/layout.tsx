import type { Metadata } from "next";
import "@/styles/globals.css";
import { cn } from "@/lib/utils/classnames";
import { plusJakartaSans, roboto } from "./fonts";
import { AppProvider } from "@/components/providers/app-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Lead Magnet Backend",
  description: "Reusable lead magnet backend system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(plusJakartaSans.variable, roboto.variable)}
    >
      <body className="font-body">
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
