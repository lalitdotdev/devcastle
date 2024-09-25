"use client"

import { Toaster as Sonner } from "sonner"
import { useTheme } from "next-themes"

type ToasterProps = React.ComponentProps<typeof Sonner>

const SonnerToaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-[#212329] group-[.toaster]:text-blue-600 group-[.toaster]:border-slate-700 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-2xl group-[.toaster]:rounded-xl group-[.toaster]:text-blue-400",
                    description: "group-[.toast]:text-blue-600",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    )
}

export { SonnerToaster }
