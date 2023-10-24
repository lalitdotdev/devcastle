import Link from "next/link";

import Image from "next/image";
import SearchBar from "./SearchBar";

import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RightNavContent from "./RightNavContent";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex fixed  top-0 inset-x-0 h-[4rem] z-[10] py-2 align-center justify-center bg-[#1B1F23]">
      <div className="container min-w-max mx-auto flex items-center justify-between gap-2">
        {/* logo */}

        <Link href="/" className="flex gap-2 items-center">
          {/* <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" /> */}

          <Image src="/logo.png" width={40} height={40} alt="" />

          <p className="hidden text-zinc-300 text-xl md:block">curiosity</p>
        </Link>

        {/* Search-Bar */}
        <SearchBar />

        <RightNavContent />
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
    </nav>
  );
};

export default Navbar;
