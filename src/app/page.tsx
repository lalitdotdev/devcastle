// import SignIn from "@/components/Auth/SignIn";
import UserAuthForm from "@/components/Auth/UserAuthForm";
// import dynamic from "next/dynamic";

import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import SignIn from "@/components/Auth/SignIn";
import { redirect } from "next/navigation";
// const SignIn = dynamic(
//   async () => (await import("@/components/Auth/SignIn")).default,
//   {
//     ssr: false,
//   },
// );
export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/feed");
  }

  return (
    <main className="grid">
      <div className="lg:overflow-hidden md:pt-12 md:pb-32 max-w-5xl mx-auto">
        <div className="mx-auto md:my-6 p-10 md:p-2">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl text-indigo-600 my-4">
              Welcome in Geek Utopia Warm Embrace!
            </h1>
            <p className="text-gray-400 md:text-xl">
              Ignite your inner geek, showcase your flawless prowess, and
              immerse in a captivating realm of clever exchanges and deep
              contemplation with software sorcerers. Embark on a grand journey
              of enlightenment and companionship, fueled by an insatiable quest
              for wisdom!
            </p>
          </div>
        </div>
        <div className="mx-auto flex flex-col gap-12 md:gap-32  ">
          <div className="md:flex gap-16 items-center">
            <div className="w-10/12 md:w-full mx-auto hidden md:block mt-14">
              <Image
                src="/assets/images/herogirl.svg"
                width={480}
                height={480}
                alt=""
              />
            </div>
            <div className="w-full md:mt-[40px] p-4 md:px-4 md:pb-8 ">
              <div className="mx-auto">
                {!session?.user ? (
                  <div className="flex flex-1 flex-col justify-center lg:flex-none">
                    <div>
                      <p className="text-center pt-2 md:pt-4 pb-8 -tracking-tight text-gray-400">
                        Continue with
                      </p>
                      <UserAuthForm />

                      <div className="inline-flex items-center justify-center w-full relative pt-4 pb-2">
                        <hr className="w-64 h-[1px] my-8  border-0 rounded bg-gray-700" />
                        <div className="absolute px-4 -translate-x-1/2 bg-[#1B1F23] left-1/2  text-gray-500">
                          OR
                        </div>
                      </div>

                      <SignIn />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col justify-center lg:flex-none items-center ">
                    <h1 className="text-center pt-2 md:pt-4 pb-8 -tracking-tight text-2xl text-indigo-400">
                      Welcome back, {session.user.name}!
                    </h1>
                    <p className="text-gray-400 md:text-xl">
                      You are logged in.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  );
}
