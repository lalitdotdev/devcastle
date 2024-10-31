"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "z-50 overflow-hidden rounded-lg",
            "bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md",
            "border border-gray-700/50",
            "px-4 py-2.5",
            "text-sm text-gray-100 shadow-xl",
            "select-none",
            // Glass reflection effect
            "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent",
            // Enhanced animations
            "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
            // Slide animations based on position
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
            // Shadow glow effect
            "after:absolute after:-z-10 after:inset-0 after:blur-xl after:bg-gradient-to-br after:from-blue-500/10 after:to-purple-500/10",
            className
        )}
        {...props}
    />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
