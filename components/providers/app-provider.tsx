"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { DialogProvider } from "@/components/dialogs/providers/dialog-provider";
import { AlertDialogProvider } from "@/components/dialogs/providers/alert-dialog-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AlertDialogProvider>
          <DialogProvider>{children}</DialogProvider>
        </AlertDialogProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
