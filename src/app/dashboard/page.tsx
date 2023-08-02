import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { UserNameForm } from "@/components/UserNameForm";

export const metadata = {
  title: "Dashboard",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  // if (!session?.user) {
  //   // redirect(authOptions?.pages?.signIn || "/");
  //   redirect("/");
  // }

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="grid items-start gap-2">
        <div className="grid ">
          <UserNameForm
            user={{
              id: session?.user.id,
              username: session?.user.username || "",
              image: session?.user.image || "",
              about: session?.user.about || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
