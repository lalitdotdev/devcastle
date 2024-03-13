"use client";

import { Backpack, BrainCog, Feather, Plus, Terminal, TerminalSquare } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/DropdownMenu";

import Link from "next/link";
import { cn } from "@/lib/utils";

const RightNavContent = () => {
    return (
        <div className="flex-shrink-0 md:block md:flex-shrink-0 md:items-center gap-4">
            <div className="text-gray-400 mr-4">
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center  p-1 md:p-2 rounded-md transition-all duration-300 ease-in-out gap-2  border border-zinc-700 cursor-pointer mt-1 md:mt-2 ">
                            <Terminal size={20} className="text-gray-500" />
                            <span>
                                <Plus size={18} className="text-gray-500" />
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-[#2D333B] text-gray-400 border border-gray-600 rounded-2xl items-center justify-center p-2 transition-all duration-300 ease-in-out">

                        <DropdownMenuItem className="cursor-pointer " asChild>
                            <Link
                                href="/cb/create"
                                className={cn(
                                    "gap-2"
                                )}
                            >
                                <Plus size={20} />
                                <span>New Castle</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700 " />
                        <DropdownMenuItem className="cursor-pointer " asChild>
                            <Link
                                href="/courses/new"
                                className={cn(
                                    "gap-2"
                                )}
                            >
                                <BrainCog size={22} />
                                <span>New thought?</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer " asChild>
                            <Link
                                href="/articles/publish"
                                className={cn(
                                    " flex p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                                )}
                            >
                                <Feather size={22} />
                                New Article
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700 " />
                        <DropdownMenuItem className="cursor-pointer " asChild>
                            <Link
                                href="/projects/new"
                                className={cn(
                                    "gap-2"
                                )}
                            >
                                <TerminalSquare size={22} />
                                <span>New Project</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer " asChild>
                            <Link
                                href="/jobs/new"
                                className={cn(
                                    " flex p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                                )}
                            >
                                <Backpack size={22} />
                                Post a Job
                            </Link>
                        </DropdownMenuItem>


                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default RightNavContent;
