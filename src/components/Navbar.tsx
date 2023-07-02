import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getAuthSession();
  // console.log(session);

  return (
    <div className=" flex fixed top-0 inset-x-0 h-[5rem] bg-zinc-100 border-b-3 border-zinc-300 z-[10] py-2 align-center justify-center ">
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* logo */}

        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-900 text-lg font-bold md:block">
            Campusbuddy
          </p>
        </Link>

        {/* Search-Bar */}

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
