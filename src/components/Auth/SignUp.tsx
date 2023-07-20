import { FC } from "react";

import Link from "next/link";
import UserAuthForm from "./UserAuthForm";
import { Icons } from "../Icons";

const SignUp: FC = ({}) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]bg-[#262a35] text-gray-400">
      <div className="flex flex-col space-y-2 text-center ">
        {/* <Icons.logo className="mx-auto h-6 w-6" /> */}

        <p className="text-sm max-w-xs mx-auto">
          By signing up on our platform, you agree to the User Agreement and
          Sign-in Policy, ensuring account security, responsible use, and data
          protection.
        </p>

        {/* SignIn form */}

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already a curious guy?{" "}
          <Link
            href="/sign-in"
            className="hover:text-brand text-sm underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
