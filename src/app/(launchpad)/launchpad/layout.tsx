import DotPattern from '@/components/ui/dotbggradient'
import LaunchPadNavbar from '@/components/launchpad/navbar/launchpad-nav'
import React from 'react'
import { cn } from '@/lib/utils'

const LaunchPadLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='relative size-full w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-600  text-white'>
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
