"use client"

import { BookMarked, BookmarkPlus, Boxes, Building, Compass, Home, List, Rocket, User } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname, useRouter } from "next/navigation"

import SidebarRouteItem from "./sidebar-route-item"

const adminRoutes = [
    {
        icon: List,
        label: "Jobs",
        href: "/admin/jobs",
    },
    {
        icon: Building,
        label: "Companies",
        href: "/admin/companies",
    },
    {
        icon: Compass,
        label: "Analytics",
        href: "/admin/analytics",
    },
]

const guestRoutes = [
    {
        icon: Home,
        label: "Home",
        href: "/",
    },
    {
        icon: Compass,
        label: "Search",
        href: "/search",
    },
    {
        icon: User,
        label: "Profile",
        href: "/user",
    },
    {
        icon: BookMarked,
        label: "Saved Jobs",
        href: "/bookmarks",
    },
    {
        icon: Rocket,
        label: "Launches",
        href: "/launches"
    },
    {
        icon: Boxes,
        label: "Categories",
        href: "/showcase/categories"
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname()
    const router = useRouter()

    const isAdminPage = pathname?.startsWith("/admin")
    const routes = isAdminPage ? adminRoutes : guestRoutes;
    return (

        <TooltipProvider><div className="flex flex-col gap-y-4 mt-4">
            {routes.map((route) => (

                <SidebarRouteItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
            ))}
        </div>
        </TooltipProvider>

    )
}


