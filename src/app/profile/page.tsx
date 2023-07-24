import { redirect } from "next/navigation";

import { authOptions, getAuthSession } from "@/lib/auth";
import { UserNameForm } from "@/components/UserNameForm";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <div className="max-w-4xl mx-auto py-12 ">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl text-gray-400">
          Settings
        </h1>

        <div className="grid gap-10">
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || "",
              image: session.user.image || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
