"use client";

import { Activity, BookMarked, BookOpenCheck, Briefcase, FilePlus, FolderKanban, GraduationCap, HeartHandshake, HelpingHand, Newspaper, TrendingUp, UserCog, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetTrigger } from "./ui/sheet";

import { FC } from "react";
import { Github } from "lucide-react";
import { Library } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { User } from "next-auth";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
    user: Pick<User, "name" | "image" | "email">;
    username: string | null | undefined;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user, username }) => {
    return (
        <div className="flex-shrink-0 md:block md:flex-shrink-0 md:items-center gap-4 justify-center items-center">
            <div className="text-gray-400 mr-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="flex items-center justify-center p-1 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ">
                            <UserAvatar
                                className="md:h-10 md:w-10 h-7 w-7"
                                user={{
                                    name: user.name || null,
                                    image: user.image || null,
                                }}
                            />
                        </div>
                    </SheetTrigger>
                    <SheetContent className="w-[380px] sm:w-[400px]  bg-[#1B1F23] text-gray-400 border border-gray-600 rounded-l-2xl p-4 text-sm overflow-hidden data-[state=closed]:animate-out">
                        <div className="space-y-1">
                            <div className="flex items-center justify-start gap-2 p-2 text-gray-400 ">
                                <div className="flex gap-4 items-center jc space-y-1 leading-none">
                                    <UserAvatar
                                        className="h-8 w-8"
                                        user={{
                                            name: user.name || null,
                                            image: user.image || null,
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        {user.name && <p className="font-medium">{user.name}</p>}
                                        {user.email && (
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Separator className="bg-gray-700" />

                            <Link
                                href={`/u/${username}`}
                                className={cn(
                                    "flex items-center  p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                                )}
                            >
                                <UserIcon size={22} />
                                <span>Your Profile</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className={cn(
                                    "flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                                )}
                            >
                                <UserCog size={22} />
                                <span>Dashboard</span>
                            </Link>

                            <Separator className="bg-gray-700 mb-2" />
                            <Link href="/feed" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <Activity size={22} />
                                <span>Your Feed</span>
                            </Link>
                            <Link href="/projects/new" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <FolderKanban size="22" />
                                <span>Projects</span>
                            </Link>

                            <Link href="/bookmarks" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <BookMarked size={22} />
                                <span>Your BookMarks </span>
                            </Link>

                            <Separator className="bg-gray-700" />
                            <SheetDescription className="text-xs">Professional Connections and get Mentorship</SheetDescription>
                            <Link href="/network" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <GraduationCap size={22} />
                                <span>Gain Mentorship</span>
                            </Link>

                            <Link href="/network" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <HeartHandshake size={22} />
                                <span>
                                    Professional Network
                                </span>
                            </Link>

                            <Separator className="bg-gray-700" />
                            <SheetDescription className="text-xs">Find and post Opportunities</SheetDescription>
                            <Link href="/jobs/new" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <FilePlus size={22} />
                                <span>Post an Opportunity</span>
                            </Link>
                            <Link
                                href="/opportunities"
                                className={cn(
                                    "flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2"
                                )}
                            >
                                <Briefcase size={22} />
                                <span>Opportunities / OS Programs</span>
                            </Link>

                            <Link href="/articles/publish" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <Library size={22} />
                                <span>Free Resources and Tools</span>
                            </Link>

                            <Link href="/articles/categories/all" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <Newspaper size={22} />
                                <span>Articles</span>
                            </Link>
                            <Separator className="bg-gray-700" />
                            <SheetDescription className="text-xs">Catalog and Archives to get you inspired</SheetDescription>
                            <Link href="/startups/catalog" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <TrendingUp size={22} />
                                <span>Startup Archives </span>
                            </Link>

                            <Link href="/interviews/catalog" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2")}>
                                <BookOpenCheck size={22} />
                                <span>Interview Catalog </span>
                            </Link>

                            <Separator className="bg-gray-700 " />



                            <SheetFooter>
                                <div className="cursor-pointer justify-end bottom-0 my-auto left-0 flex-grow " onClick={
                                    (event) => {
                                        event.preventDefault();
                                        signOut({
                                            callbackUrl: `${window.location.origin}/`,
                                        });
                                    }
                                }>
                                    Sign Out
                                </div>
                                <div className="flex gap-2">
                                    <Link href="https://github.com/mrExplorist/devcastle" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2 hover:text-blue-800")}>
                                        <Github size={24} />
                                    </Link>

                                    <Link href="" className={cn("flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2 hover:text-blue-800")}>
                                        <HelpingHand size={26} />
                                    </Link>
                                </div>
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div >
    );
};

export default UserAccountNav;
