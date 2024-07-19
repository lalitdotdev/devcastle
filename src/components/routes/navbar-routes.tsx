"use client"

import { LogOut, PersonStanding } from "lucide-react"

import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NavbarRoutes = () => {
    const pathname = usePathname()
    const isAdminPage = pathname?.startsWith('/admin')
    const isClientPage = pathname?.startsWith('/jobs')
    return (
        <>
            <div className="flex gap-x-2 ml-auto">
                {
                    isAdminPage || isClientPage ? <Link href={"/"} className="text-gray-500 hover:text-gray-700">
                        <Button variant={'ghost'} size={'sm'} className="flex items-center text-gray-500 hover:text-gray-700 gap-1">
                            <LogOut />
                            Exit
                        </Button>
                    </Link> : <Link href={"/admin"} className="text-gray-500 hover:text-gray-700">
                        <Button variant={'ghost'} size={'sm'} className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700 border-none hover:bg-none">
                            <PersonStanding />
                            <span className="hidden md:block">Admin Mode</span>

                        </Button>
                    </Link>
                }
            </div>
        </>
    )
}
