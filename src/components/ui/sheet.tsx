"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet        = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose   = SheetPrimitive.Close
const SheetPortal  = SheetPrimitive.Portal

// ── Overlay ───────────────────────────────────────────────────────────────────
const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        ref={ref}
        className={cn(
            // Dark translucent scrim — matches bg-[#0d0d0f] base
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in  data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            className
        )}
        {...props}
    />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

// ── Content variants ──────────────────────────────────────────────────────────
const sheetVariants = cva(
    // Base — matches the exact card/drawer surface used in UserAccountNav & NotificationIcon
    cn(
        "fixed z-50 bg-[#0d0d0f] shadow-2xl shadow-black/60",
        "border-zinc-800/60",
        "transition ease-in-out",
        "data-[state=open]:animate-in  data-[state=open]:duration-300",
        "data-[state=closed]:animate-out data-[state=closed]:duration-200",
        "focus:outline-none",
    ),
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
                bottom: "inset-x-0 bottom-0 border-t rounded-t-2xl data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
                left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
                right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
            },
        },
        defaultVariants: { side: "right" },
    }
)

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

// ── SheetContent ──────────────────────────────────────────────────────────────
const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
            ref={ref}
            className={cn(sheetVariants({ side }), className)}
            {...props}
        >
            {children}

            {/* Close button — matches the h-8 w-8 rounded-lg ghost icon pattern */}
            <SheetPrimitive.Close
                className={cn(
                    "absolute right-4 top-4 z-10",
                    "flex items-center justify-center h-7 w-7 rounded-lg",
                    "border border-zinc-800 bg-zinc-900/60",
                    "text-zinc-600 hover:text-zinc-200 hover:border-zinc-700",
                    "transition-all duration-200",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/50",
                    "disabled:pointer-events-none",
                )}
            >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
        </SheetPrimitive.Content>
    </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

// ── SheetHeader ───────────────────────────────────────────────────────────────
const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-1 text-left", className)}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

// ── SheetFooter ───────────────────────────────────────────────────────────────
const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-auto",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

// ── SheetTitle ────────────────────────────────────────────────────────────────
const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn("text-sm font-semibold text-zinc-100 leading-tight", className)}
        {...props}
    />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

// ── SheetDescription ──────────────────────────────────────────────────────────
const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn("text-[11px] text-zinc-600 leading-relaxed", className)}
        {...props}
    />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}