"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers: FC<LayoutProps> = ({
  children,
  ...props
}: ThemeProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        {...props}
      > */}
      <SessionProvider>{children}</SessionProvider>
      {/* </NextThemesProvider> */}
    </QueryClientProvider>
  );
};

export default Providers;
