"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import UserAvatar from "./UserAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

// import { signOut } from "next-auth/react";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
  username: string | null | undefined;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user, username }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8 border-2 border-zinc-300 "
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-[#1B1F23] text-gray-400 w-48 border border-gray-700"
        align="end"
      >
        {/* Link to /username */}

        <Link href={`/u/${username}`}>
          <div className="flex items-center justify-start gap-2 p-2 text-gray-400">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium">{user.name}</p>}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </Link>

        <DropdownMenuItem asChild>
          <Link href="/feed">Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/cbjobboard">Job Opportunities</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
