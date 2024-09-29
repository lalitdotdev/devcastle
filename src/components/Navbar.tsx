import { Badge } from "./ui/badge";
import KeyboardShortcuts from "@/lib/hotkeys";
import Link from "next/link";
import NotificationIcon from "./Navbar/NotificationIcon";
import RabbitIcon from "./Icons";
import RightNavContent from "./RightNavContent";
import SearchBar from "./SearchBar";
import { Separator } from "./ui/separator";
import { TerminalSquare } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import { authOptions } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/Button";
import { getServerSession } from "next-auth";

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <nav className="fixed top-0 w-full z-10 bg-[#1B1F23] border-b-2 border-zinc-800 backdrop-blur-lg">
            <div className="container max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-zinc-400">
                    <TerminalSquare
                        size={30} // Smaller size for small screens
                        className="text-indigo-600"
                    />
                    <span className="hidden md:block text-xl">devcastle</span> {/* Only show on medium screens and above */}
                </Link>

                {/* Search Bar and Nav Links */}
                <div className="flex items-center">
                    {/* Search Bar */}
                    <div className=" items-center mx-1">
                        <SearchBar />
                    </div>

                    {/* Separator for medium screens */}
                    <Separator orientation="vertical" className="h-6 w-0.5 bg-zinc-600 hidden sm:block mx-1" />

                    {/* Right Side Content */}
                    {session?.user?.email && (
                        <div className="hidden md:flex items-center mx-1">
                            <RightNavContent />
                            <KeyboardShortcuts />
                        </div>
                    )}

                    <Separator orientation="vertical" className="h-6 w-0.5 bg-zinc-600 hidden sm:block mx-1" />

                    {/* Rabbit Icon with Badge */}
                    {session?.user?.email && (
                        <div className="relative flex items-center mr-3 border rounded-xl border-zinc-800 py-2 px-2">
                            <Link href="/launchpad" className="text-teal-300">
                                <RabbitIcon className="text-teal-500" />
                            </Link>
                            <Badge
                                variant="outline"
                                className="absolute -top-2 -right-2 px-1 py-0.5 text-[0.6rem] bg-teal-300 text-yellow-800 border-yellow-300"
                            >
                                WIP
                            </Badge>
                        </div>
                    )}

                    {/* Notification Icon */}
                    {session?.user?.email && (
                        <NotificationIcon />
                    )}


                    {/* User Account or Sign-in */}
                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <UserAccountNav user={session.user} username={session?.user?.username} />
                        ) : (
                            <Link href="/sign-in" className={buttonVariants({
                                size: "sm",
                                className: "text-zinc-300 border border-zinc-500 "
                            })}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
