"use client";

import { Backpack, Bell, Brain, Feather, Plus } from "lucide-react";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

const RightNavContent = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0 md:items-center gap-4  ">
      <div className="text-gray-400 mr-4 hidden md:flex  ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Bell className="h-6 w-6 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 hidden md:flex bg-[#1B1F23] text-gray-400 border-gray-600"
            align="end"
          >
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-gray-400 mr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Plus className="h-6 w-6 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-[#1B1F23] text-gray-400 hidden md:block   border border-gray-600 rounded-sm "
            align="end"
          >
            <DropdownMenuItem className="cursor-pointer " asChild>
              <Link
                href="/cb/create"
                className="flex items-center justify-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>New Community</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex-start ">
              <Link href="/feed" className="flex items-center justify-center">
                <Brain className="mr-2 h-4 w-4" />
                <span>New Post</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex-start ">
              <Link href="/feed" className="flex items-center justify-center">
                <Backpack className="mr-2 h-4 w-4" />
                <span>Explore Gigs</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/write" className="flex items-center justify-center">
                <Feather className="mr-2 h-4 w-4" />
                <span>New Article</span>
              </Link>
            </DropdownMenuItem>

            {/* <DropdownMenuItem className="cursor-pointer ">
          <Briefcase className="mr-2 h-4 w-4" />
          <span>Post Gig</span>
        </DropdownMenuItem> */}
            {/* <DropdownMenuItem className="cursor-pointer ">
          <Globe2 className="mr-2 h-4 w-4" />
          <span>Post Opportunity</span>
        </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default RightNavContent;
