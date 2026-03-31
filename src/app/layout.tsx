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
    authModal,
}: {
    children: React.ReactNode;
    authModal?: React.ReactNode;
}) {
    const session = await getAuthSession();
    const hasSidebar = !!session?.user;
 
    return (
        <html
            lang="en"
            className={cn(
                "dark antialiased",
                inter.className
                , DM_Sansfont.variable,
                fontHeading.variable,
                fontBody.variable
            )}
            // Prevent FOUC on dark background
            style={{ colorScheme: "dark" }}
        >
            <body
                className={cn(
                    "min-h-screen bg-[#0d0d0f] text-zinc-100 antialiased",
                    // Push content right when sidebar is present
                    hasSidebar && "md:pl-16",
                )}
            >
                <Providers>
                    {/* ── Progress bar ── */}
                    <NextTopLoader
                        color="#8b5cf6"
                        initialPosition={0.08}
                        crawlSpeed={200}
                        height={2}
                        showSpinner={false}
                        easing="ease"
                        speed={200}
                        shadow="0 0 10px #8b5cf6,0 0 5px #8b5cf6"
                    />
 
                    {/* ── Fixed ambient background ── */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
                        <div className="absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full bg-violet-600/4 blur-[140px]" />
                        <div className="absolute top-1/2 -right-60 h-[500px] w-[500px] rounded-full bg-cyan-600/4 blur-[120px]" />
                        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/4 blur-[100px]" />
                    </div>
 
                    {/* ── Navbar ── */}
                    <header className="fixed inset-x-0 top-0 z-50 h-14">
                        {/* @ts-expect-error Server Component */}
                        <Navbar />
                    </header>
 
                    {/* ── Sidebar (authenticated only) ── */}
                    {hasSidebar && (
                        <aside className="fixed inset-y-0 left-0 z-40 w-16 pt-14">
                            <Sidebar />
                        </aside>
                    )}
 
                    {/* ── Auth modal slot ── */}
                    {authModal}
 
                    {/* ── Main content ── */}
                    <main
                        className={cn(
                            "relative z-10 min-h-screen pt-14",
                            // Extra top padding so content clears the fixed navbar
                        )}
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                            {children}
                        </div>
                    </main>
 
                    {/* ── Toast providers ── */}
                    <Toaster />
                    <SonnerToaster />
                </Providers>
            </body>
        </html>
    );
}
