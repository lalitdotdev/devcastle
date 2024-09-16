import Link from "next/link";
import NotificationIcon from "./Navbar/NotificationIcon";
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
        <nav className="m-auto fixed h-fit top-0  -z-[10] py-2 md:py-4 align-center justify-center  bg-[#1B1F23]  left-0 w-full border-b-2 border-zinc-800 backdrop-filter backdrop-blur-2xl">
            <div className="container max-w-7xl justify-between min-w-max mx-auto flex items-center gap-2 px-5 md:px-4 py-2 ">

                <Link
                    href="/"
                    className="items-center justify-center gap-2 sm:flex text-zinc-400"
                >
                    <TerminalSquare
                        size={42}
                        className="animate-pulse transition-all duration-800 ease-in-out text-indigo-600"
                    />

                    <span className="font-md hidden md:block items-center justify-center text-xl">
                        devcastle
                    </span>


                </Link>

                {/* Search-Bar */}
                <div className="flex justify-center items-center gap-3">
                    <SearchBar />

                    <Separator orientation="vertical" className="h-6 w-0.5 bg-zinc-600" />
                    {/* <NavbarRoutes /> */}
                    <div className="flex">
                        {session?.user?.email && <RightNavContent />}

                        {/* TODO: THEMETOGGLE BUTTON HERE */}

                        {/* actions */}
                        {session?.user ? (
                            <div className="flex justify-center items-center gap-2">
                                <NotificationIcon />

                                <UserAccountNav
                                    user={session.user}
                                    username={session?.user?.username}
                                />

                            </div>
                        ) : (
                            <Link href="/sign-in" className={buttonVariants({
                                size: "sm",
                                className: "text-zinc-300 border border-zinc-500 "
                            })}>
                                SignIn
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
