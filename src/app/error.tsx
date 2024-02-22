"use client"; // Error components must be Client Components

import { toast } from "@/hooks/use-toast";
import { Home, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    toast({
      variant: "destructive",
      description: "Something unexpected happend",
      title: "Some Error Occured!",
    });
    console.log(error.message);
  }, [error]);

  return (
    <div className="m-auto my-10  space-y-5 py-3 text-center items-center max-h-screen overflow-hidden justify-center">
      {/* Image here */}
      <div className="flex justify-center relative">
        <Image
          src="/assets/images/notfound.svg"
          alt="Error"
          width={400}
          height={400}
        />

        <pre className="text-gray-500 border-2 border-red-500  w-fit absolute rounded-md p-4 ml-12">
          <code>{error.message}</code>
        </pre>
      </div>
      <h1 className="text-xl text-red-600 font-bold">Something went wrong!</h1>
      <p className="text-gray-500">
        We are sorry, something went wrong. Please try again.
      </p>
      <p className="text-gray-500">
        If the problem persists, please contact support.
      </p>

      <div className="flex gap-2 items-center justify-center">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          <RotateCw />
          Try again
        </button>
        <Link href="/">
          <p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 justify-center items-center">
              <Home />
              Go to Home
            </button>
          </p>
        </Link>
      </div>
    </div>
  );
}
