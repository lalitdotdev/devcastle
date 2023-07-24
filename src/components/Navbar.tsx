import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/Button";

import Image from "next/image";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const session = await getAuthSession();
  // console.log(session);

  return (
    <nav className="flex fixed top-0 inset-x-0 h-[4rem] z-[10] py-2 align-center justify-center bg-[#1B1F23]">
      <div className="container max-w-8xl mx-auto flex items-center justify-between gap-2">
        {/* logo */}

        <Link href="/" className="flex gap-2 items-center">
          {/* <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" /> */}

          <Image src="/logo.png" width={40} height={40} alt="" />

          <p className="hidden text-zinc-300 text-xl md:block">curiosity</p>
        </Link>

        {/* Search-Bar */}

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
    </nav>
  );
};

export default Navbar;
