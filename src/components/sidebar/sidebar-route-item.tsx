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
        <div onClick={onClick} className={cn("flex items-center gap-x-2 py-4 text-zinc-400 text-sm font-[500] pl-6 cursor-pointer", isActive && "border-r-4 border-blue-600 text-blue-600")}>
            <div className="flex items-center gap-x-2 ">
                <Tooltip>
                    <TooltipTrigger>
                        <Icon size={24} className="mr-4" />
                    </TooltipTrigger >
                    <TooltipContent side="right" className="text-xs">
                        <span>{label}</span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}

export default SidebarRouteItem
