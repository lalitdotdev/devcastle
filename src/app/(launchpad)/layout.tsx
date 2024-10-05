import DotPattern from '@/components/ui/dotbggradient'
import LaunchPadNavbar from '@/components/launchpad/navbar/launchpad-nav'
import { Metadata } from "next";
import React from 'react'
import { authOptions } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';

// metadata

export const metadata: Metadata = {
    title: "LaunchPad 🚀",
    description: "LaunchPad",
};

const LaunchPadLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);
    // console.log(session)
    if (!session?.user) {
        return redirect('/auth/signin')
    }

    return (
        <div className='relative size-full w-full items-center justify-center overflow-hidden rounded-lg  text-white mt-10 min-h-[60vh]'>
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    '[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]',
                )}
            />
            <LaunchPadNavbar />
            <main>
                {children}
            </main>

        </div>
    )
}

export default LaunchPadLayout
