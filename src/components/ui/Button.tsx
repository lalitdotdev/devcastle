import * as React from "react";

import { VariantProps, cva } from "class-variance-authority";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium  focus:outline-none focus:ring-1 focus:ring-slate-400  disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900",
    {
        variants: {
            variant: {
                default: "outline-none focus:outline-none focus:ring-indigo-500 focus:ring-offset-slate-900 text-indigo-500",
                destructive: "text-white hover:bg-red-600 dark:hover:bg-red-600",
                outline:
                    "hover:bg-indigo-500 outline outline-1 outline-blue-300",
                subtle: "bg-none text-indigo-600 border-2 border-indigo-600",
                ghost:
                    "bg-transparent hover:bg-zinc-100 text-zinc-800 data-[state=open]:bg-transparent data-[state=open]:bg-transparent",
                link: "bg-transparent  underline-offset-4 hover:underline dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-2 rounded-md",
                xs: "h-8 px-1.5 rounded-sm",
                lg: "h-11 px-8 rounded-md",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant, isLoading, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-500" />
                ) : null}
                {children}
            </button>
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
