"use client";

import CloseModal from "@/components/Auth/CloseModal";
import SignUp from "@/components/Auth/SignUp";

const page = ({}) => {
  return (
    <div className="fixed inset-0 z-10 ">
      <div className="container flex items-center h-full max-w-lg mx-auto ">
        <div className="relative bg-[#262a35] w-full h-fit py-20 px-2 rounded-lg border border-zinc-600 text-gray-400">
          <SignUp />
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
        </div>
      </div>
      Interceptor page
    </div>
  );
};

export default page;
