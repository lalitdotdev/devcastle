import { getProductsByUserId, isUserPremium } from "@/lib/launchpad-server-actions/server-actions";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const NewProductLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const authenticatedUser = await getServerSession(authOptions);

    const products = await getProductsByUserId(authenticatedUser?.user?.id || "");

    const isPremium = await isUserPremium();

    if (!isPremium && products.length === 2) {
        redirect("/launchpad");
    }

    if (!authenticatedUser) {
        redirect("/");
    }

    return <>{children}</>;
};

export default NewProductLayout;
