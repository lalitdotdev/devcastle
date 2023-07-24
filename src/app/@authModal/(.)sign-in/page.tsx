"use client";

import CloseModal from "@/components/Auth/CloseModal";
import SignIn from "@/components/Auth/SignIn";
import UserAuthForm from "@/components/Auth/UserAuthForm";

const page = ({}) => {
  return (
    <div className="fixed inset-0 z-10 ">
      <div className="container flex items-center h-full max-w-lg mx-auto ">
        <div className="relative bg-[#262a35] w-full py-20 px-2 h-fit rounded-lg border border-zinc-600 text-gray-400">
          <UserAuthForm />
          <div className="inline-flex items-center justify-center w-full relative pt-4 pb-2">
            <hr className="w-64 h-[1px] my-8  border-0 rounded bg-gray-700" />
            <div className="absolute px-4 -translate-x-1/2 bg-[#262a35] left-1/2  text-gray-200">
              OR
            </div>
          </div>
          <SignIn />
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
