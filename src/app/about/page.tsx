// app/about/page.js

import { AboutContent } from "./_components/AboutContent";

export const metadata = {
    metadataBase: new URL('https://devcastle.vercel.app'),
    alternates: {
        canonical: '/about',
        languages: {
            'en-US': '/en-US',
        },
    },
    title: 'Devcastle — About',
    description: 'Learn more about Devcastle and the rationale behind its creation.',
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
};

export default function About() {
    return (
        <div className=" bg-gradient-to-br  text-white py-12 px-8 overflow-hidden">
            <AboutContent />
        </div>
    );
}
