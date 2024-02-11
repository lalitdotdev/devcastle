import Link from "next/link";

import SearchBar from "./SearchBar";

import UserAccountNav from "./UserAccountNav";

import { authOptions } from "@/lib/auth";
import RightNavContent from "./RightNavContent";

import { TerminalSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { getServerSession } from "next-auth";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex m-auto fixed h-fit top-0  inset-x-0  z-[10] py-2 align-center justify-center  bg-[#1B1F23] ">
      <div className="container min-w-max mx-auto flex items-center justify-between gap-2 ">
        <Link
          href="/"
          className="items-center justify-center gap-2 sm:flex text-gray-500"
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
            size={40}
            className="animate-pulse transition-all duration-800 ease-in-out text-indigo-600"
          />

          {/* campusbuddy.networks */}
          <span className=" text-md font-medium hidden md:block">
            DevCastle
            {/* indigo colored dot but bit larger */}
            <span className="text-indigo-600 text-2xl">.</span>
            Network
          </span>
        </Link>

        {/* Search-Bar */}
        <SearchBar />

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
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
