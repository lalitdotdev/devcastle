import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import NextTopLoader from 'nextjs-toploader';
import { Poppins } from "next/font/google";
import Providers from "@/components/Providers";
import Sidebar from "@/components/sidebar/sidebar";
import { SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";

export const metadata = {
    title: "DevCastle",
    description:
        "DevCastle is a platform by the developers and for the developers to connect talents with opportunities. We are a community of developers, designers, and creators who are passionate about building and creating things.",
};

//importing custom fonts

const inter = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700'] });

export default async function RootLayout({
    children,
    authModal, // receiving authModal as a prop as it is a server component
}: {
    children: React.ReactNode;
    authModal?: React.ReactNode;
}) {

    const session = await getAuthSession();


    return (
        <html
            lang="en"
            className={cn(
                "bg-white text-slate-900 antialiased light",
                inter.className
            )}
        >
            <body className="min-h-screen pt-12 bg-[#1B1F23] antialiased pb-4">
                <Providers>
                    <NextTopLoader />
                    <header className="h-20 fixed inset-y-0 w-full z-50">
                        {/* @ts-expect-error Server Component */}
                        <Navbar />
                    </header>



                    {/* Sidebar only for auth user */}
                    {/* {session?.user && ( */}
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <Sidebar />
                    </div>
                    {/* )} */}





                    {/* Rendering authModal alongside other components */}
                    {authModal}

                    <div className="container max-w-9xl mx-auto h-full pt-12">
                        {children}
                    </div>



                </Providers>
                <Toaster />
                <SonnerToaster />
            </body>
        </html>
    );
}
