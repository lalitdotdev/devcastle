"use client";

import { Backpack, BrainCog, Feather, Plus, Rocket, Terminal, TerminalSquare } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "./ui/DropdownMenu";

import Link from "next/link";
import { cn } from "@/lib/utils";

const RightNavContent = () => {
    return (
        <div className="flex-shrink-0 md:block md:flex-shrink-0 md:items-center gap-4">
            <div className="text-gray-400 ">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative flex items-center justify-center p-1 md:p-2 rounded-md transition-transform duration-300 ease-in-out gap-2 border border-zinc-700 cursor-pointer mt-1 md:mt-2 hover:bg-gray-800 hover:border-gray-600 transform hover:scale-105">
                            <Terminal size={20} className="text-gray-500" />
                            <span>
                                <Plus size={18} className="text-gray-500" />
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-800 text-gray-400 border border-gray-600 rounded-xl p-2 transition-transform duration-300 ease-in-out shadow-lg">
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/cb/create" className={cn("flex items-center gap-2")}>
                                <Plus size={20} className="text-lime-500" />
                                <span>New Castle</span>
                                <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/courses/new" className={cn("flex items-center gap-2")}>
                                <BrainCog size={22} className="text-lime-500" />
                                <span>New thought?</span>
                                <DropdownMenuShortcut>Ctrl+T</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/articles/publish" className={cn("flex items-center gap-2")}>
                                <Feather size={22} className="text-lime-500" />
                                New Article
                                <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/launchpad/new-product" className={cn("flex items-center gap-2")}>
                                <Rocket size={22} className="text-lime-500" />
                                <span>New Product</span>
                                <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/jobs/new" className={cn("flex items-center gap-2")}>
                                <Backpack size={22} className="text-lime-500" />
                                Post a Job
                                <DropdownMenuShortcut>Ctrl+J</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default RightNavContent;
