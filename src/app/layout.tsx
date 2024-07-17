import "@/styles/globals.css";

import { Inter, Poppins } from "next/font/google";

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "DevCastle",
    description:
        "DevCastle is a platform by the developers and for the developers to connect talents with opportunities. We are a community of developers, designers, and creators who are passionate about building and creating things.",
};

//importing custom fonts

const inter = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700'] });

export default function RootLayout({
    children,
    authModal, // receiving authModal as a prop as it is a server component
}: {
    children: React.ReactNode;
    authModal?: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn(
                "bg-white text-slate-900 antialiased light",
                inter.className
            )}
        >
            <body className="min-h-screen pt-12 bg-[#1B1F23] antialiased">
                <Providers>
                    {/* @ts-expect-error Server Component */}
                    <Navbar />
                    {/* Rendering authModal alongside other components */}
                    {authModal}
                    <div className="container max-w-7xl mx-auto h-full pt-12">
                        {children}
                    </div>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
