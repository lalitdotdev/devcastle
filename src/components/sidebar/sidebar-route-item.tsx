"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { usePathname, useRouter } from "next/navigation";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarRouteItemProps {
    icon: LucideIcon;
    label: string;
    href: string;

}



const SidebarRouteItem = ({ icon: Icon, label, href }: SidebarRouteItemProps) => {
    const pathname = usePathname()
    const router = useRouter()

    const isActive = (pathname === '/' && href === '/') || pathname === href || pathname?.startsWith(`${href}/`)

    const onClick = () => {
        router.push(href)
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    onClick={onClick}
                    className={cn(
                        "group relative flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-300 ease-out",
                        "hover:bg-zinc-800/80",
                        isActive ? "text-indigo-400 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "text-zinc-400 hover:text-zinc-200"
                    )}
                >
                    <Icon size={24} className={cn("transition-transform duration-300 group-hover:scale-110", isActive && "scale-110")} />

                    {/* Active Indicator Dot */}
                    {isActive && (
                        <div className="absolute -left-1 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    )}

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/5 to-transparent transition-opacity duration-300 -z-10" />
                </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10} className="bg-zinc-900 text-zinc-100 border-zinc-800 px-3 py-1.5 text-xs font-medium rounded-lg shadow-xl">
                <span>{label}</span>
            </TooltipContent>
        </Tooltip>
    )
}

export default SidebarRouteItem
