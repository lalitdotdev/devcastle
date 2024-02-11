"use client";
import H1 from "@/components/h1";
import { Home, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function NotFound({ reset }: { reset: () => void }) {
  return (
    <div className="m-auto my-10  space-y-5 py-3 text-center items-center max-h-screen overflow-hidden justify-center">
      <H1 className="text-red-500">404! Not Found</H1>
      <p className="text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>

      {/* Image here */}
      <div className="flex justify-center relative">
        <Image
          src="/assets/images/notfound.svg"
          alt="Error"
          width={400}
          height={400}
        />
      </div>

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
        <Link href="/cbjobboard">
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
