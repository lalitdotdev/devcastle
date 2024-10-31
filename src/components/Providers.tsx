"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { FC, ReactNode } from "react";
import { TooltipProvider } from "./ui/tooltip";

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
            <TooltipProvider>
                <SessionProvider>{children}</SessionProvider>
            </TooltipProvider>
            {/* </NextThemesProvider> */}
        </QueryClientProvider>
    );
};

export default Providers;
