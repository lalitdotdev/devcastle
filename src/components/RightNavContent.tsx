"use client";

import { Backpack, Brain, Cross, Feather, TerminalSquare } from "lucide-react";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { cn } from "@/lib/utils";

const RightNavContent = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0 md:items-center gap-4">
      <div className="text-gray-400 mr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2 border-dashed border-2 border-indigo-600 cursor-pointer ">
              <TerminalSquare size={26} />
              <span>
                Create
                <span className="hidden ml-2 md:inline-block"> New</span>
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1B1F23] text-gray-400 hidden md:block border border-gray-600 rounded-sm p-2">
            <DropdownMenuItem className="cursor-pointer " asChild>
              <Link
                href="/cb/create"
                className={cn(
                  "flex items-center justify-center font-semibold p-2 rounded-md transition-all duration-300 ease-in-out gap-2 border-b border-gray-600 bg-[#282C35]"
                )}
              >
                <Cross size={20} />
                <span>New Castle</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer " asChild>
              <Link
                href="/courses/new"
                className={cn(
                  " font-semibold flex p-2  rounded-md transition-all duration-300 ease-in-out gap-2 border-b border-gray-600 bg-[#282C35]"
                )}
              >
                <Brain size={22} />
                <span>New Post</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer " asChild>
              <Link
                href="/jobs/new"
                className={cn(
                  " font-semibold flex p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                )}
              >
                <Backpack size={22} />
                Post a Job
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer " asChild>
              <Link
                href="/articles/publish"
                className={cn(
                  " font-semibold flex p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                )}
              >
                <Feather size={22} />
                New Article
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-600" />

            <DropdownMenuItem className="cursor-pointer " asChild>
              <Link
                href="/projects/new"
                className={cn(
                  " font-semibold flex p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                )}
              >
                {/* Animate this icon */}
                <TerminalSquare size={22} />
                New Project
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default RightNavContent;
