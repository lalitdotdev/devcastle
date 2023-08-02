import { getAuthSession } from "@/lib/auth";
import { FC } from "react";

import { Bell, Brain, Feather, Globe2, MenuSquare, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/Button";

interface RightNavContentProps {}

const RightNavContent = async () => {
  const session = await getAuthSession();
  return (
    <div className="hidden md:flex md:flex-shrink-0 md:items-center gap-4 ">
      <div className="text-gray-400 mr-4 hidden md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Bell className="h-6 w-6 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 hidden md:flex">
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
      {session?.user ? (
        <UserAccountNav user={session.user} />
      ) : (
        <Link
          href="/sign-in"
          className={buttonVariants({
            className:
              " border border-indigo-600 text-indigo-600 whitespace-nowrap",
          })}
        >
          Sign In
        </Link>
      )}
    </div>
  );
};

export default RightNavContent;
