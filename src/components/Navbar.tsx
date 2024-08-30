import Link from "next/link";
import { NavbarRoutes } from "./routes/navbar-routes";
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
            <div className="max-w-7xl justify-between min-w-max mx-auto flex items-center  gap-2 px-5 md:px-4 py-2 ">
                <Link
                    href="/"
                    className="items-center justify-center gap-2 sm:flex text-zinc-400"
                >
                    {/* <Image
            src={logo}
            alt="Campus Buddy"
            width={30}
            height={30}
            className="hidden"
          />
          <p className="rounded-lg hidden md:block border-2 border-r-8 sm:hidden border-l-4 border-b-2 border-green-600 px-2 py-1 text-md font-bold transition-all hover:-translate-y-[2px] dark:border-green-600 text-white ">
            <div className="inline-block align-middle">
              <Image src={logo} alt="Campus Buddy" width={30} height={30} />
            </div>
            <span className="text-green-600 mr-[1px]">campus</span>buddy
          </p> */}

                    <TerminalSquare
                        size={42}
                        className="animate-pulse transition-all duration-800 ease-in-out text-indigo-600"
                    />

                    {/* devcastle.networks */}
                    <span className="font-md hidden md:block items-center justify-center text-xl">
                        devcastle
                        {/* indigo colored dot but bit larger */}
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
                            <UserAccountNav
                                user={session.user}
                                username={session?.user?.username}
                            />
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
