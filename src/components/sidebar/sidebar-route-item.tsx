"use client"

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
        <button onClick={onClick} className={cn("flex items-center gap-x-2 py-4 text-zinc-400 text-sm font-[500] pl-6 cursor-pointer", isActive && "bg-gray-100")}>
            <div className="flex items-center gap-x-2 ">
                <Icon size={24} className="mr-4" />
                <span>{label}</span>
            </div>
        </button>
    )
}

export default SidebarRouteItem
