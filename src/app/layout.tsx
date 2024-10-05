import "@/styles/globals.css";
import "@uploadthing/react/styles.css";

import { DM_Sans, Inter, Poppins } from "next/font/google";

import Navbar from "@/components/Navbar";
import NextTopLoader from 'nextjs-toploader';
import Providers from "@/components/Providers";
import Sidebar from "@/components/sidebar/sidebar";
import { SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";

export const metadata = {
    title: "DevCastle",
    description:
        "DevCastle is a platform by the developers and for the developers to connect talents with opportunities. We are a community of developers, designers, and creators who are passionate about building and creating things.",
};

// Importing custom fonts
const inter = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700'] });

const DM_Sansfont = DM_Sans({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
})

const fontHeading = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-heading',
})

const fontBody = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
})


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
                , DM_Sansfont.variable,
                fontHeading.variable,
                fontBody.variable
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
                    {session?.user && (
                        <div className="fixed inset-y-0 left-0 z-[100] w-fit">
                            <Sidebar />
                        </div>
                    )}

                    {/* Rendering authModal alongside other components */}
                    {authModal}

                    <div className="container  mx-auto h-full pt-12">
                        {children}
                    </div>

                    <Toaster />
                    <SonnerToaster />
                </Providers>
            </body>
        </html>
    );
}
