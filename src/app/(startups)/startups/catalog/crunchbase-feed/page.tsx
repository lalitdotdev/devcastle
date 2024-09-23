// app/crunchbase-feed/page.tsx

import CrunchbaseFeed from '@/components/Feed/CrunchbaseFeed';
import DotPattern from '@/components/ui/dotbggradient';
import React from 'react';
import { cn } from '@/lib/utils';

export const metadata = {
    title: 'Crunchbase Feed | Your Platform Name',
    description: 'Explore trending companies and startups from Crunchbase',
};

export default function CrunchbaseFeedPage() {
    return (
        <div className="min-h-screen pt-12  text-white">
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
            <header className=" text-white">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold gradient-text animate-gradient">Crunchbase Explorer</h1>
                    <p className="text-gray-400 mt-2">Discover and analyze trending companies and startups</p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <section className="mb-8 min-h-[60vh] border-l-2 border-zinc-700">

                    <CrunchbaseFeed />
                </section>

                <section className="mt-12 bg-gray-800 rounded-lg p-6 border-l-4 border-teal-600">
                    <h2 className="text-2xl font-semibold mb-4">About This Feed</h2>
                    <p className="text-gray-300">
                        This feed showcases trending companies from Crunchbase, providing you with up-to-date information on funding, founding dates, and company sizes. Explore the innovative startups and established firms making waves in the business world.
                    </p>
                    <p className="text-gray-300 mt-4">
                        Data is sourced directly from Crunchbase and updated regularly. Click on a company card to visit their website and learn more.
                    </p>
                </section>
            </main>

            <footer className="bg-gray-800 mt-12 ">
                <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} devcastle. Data provided by Crunchbase.</p>
                </div>
            </footer>
        </div >
    );
}
