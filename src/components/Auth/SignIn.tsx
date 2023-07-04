import { FC } from "react";
import { Icons } from "../Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignIn: FC = ({}) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back!</h1>

        <p className="text-sm max-w-xs mx-auto">
          By signing in to CampusBuddy, you agree to the User Agreement and
          Sign-in Policy, ensuring account security, responsible use, and data
          protection.
        </p>

        {/* SignIn form */}

        <UserAuthForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          New to CampusBuddy?{" "}
          <Link
            href="/sign-up"
            className="hover:text-brand text-sm underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
