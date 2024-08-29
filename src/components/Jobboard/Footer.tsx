import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    const links = [
        {
            id: 1,
            href: '/about',
            label: 'About',
        },
        {
            id: 2,
            href: 'https://forms.gle/',
            label: 'Add a resource',
        },
        {
            id: 3,
            href: 'https://forms.gle',
            label: 'Submit feedback',
        },
        {
            id: 4,
            href: 'https://ko-fi.com/',
            label: 'Support this project',
        },
        {
            id: 5,
            href: 'https://github.com/mrExplorist/devcastle',
            label: 'Contribute on Github',
        },
        {
            id: 6,
            href: '/legal',
            label: 'Legal',
        },
    ];

    return (
        <footer className="mt-32 ">
            <div className="border-b border-b-zinc-600 pb-6">
                <span className="sr-only">DEVCASTLE</span>
                <div className="flex items-center justify-center w-full py-2">
                    <h2 className=" text-6xl uppercase font-extrabold text-light-gray md:text-[12rem]">devcastle</h2>

                </div>
                <p className='text-center text-sm text-light-gray'>
                    Castle of developers , designers , creators , builders , and more.
                </p>
            </div>
            <div className="flex flex-col gap-y-12 gap-x-2 md:flex-row items-start justify-between pt-6 pb-10 text-neutral-500">
                <div className="gap-y-4 b-8 flex flex-col text-base  text-[1.2rem] ">
                    <div className="flex w-56 gap-x-1 xl:w-96 ">
                        <span className="w-fit flex-nowrap whitespace-nowrap ">Made & Curated by </span>{' '}
                        <Link
                            className="font-bold relative overflow-y-hidden w-full group h-fit"
                            target="_blank"
                            href="https://litsharmadev.tech/"
                        >
                            <span className="flex group-hover:-translate-y-5 group-hover:opacity-0 transition-all ease-in-out-circ duration-500">
                                Lalit
                            </span>
                            <span className="absolute inset-0 group-hover:translate-y-0 translate-y-5 xl:translate-y-8 transition-all ease-in-out-circ duration-500 underline flex-nowrap whitespace-nowrap">
                                Lalit Sharma :)
                            </span>
                        </Link>
                    </div>

                    <Link href="/sitemap.xml" className=" flex items-start justify-start" target="_blank">
                        sitemap.xml
                    </Link>
                    <div>
                        &copy; {new Date().getFullYear()} devcastle . All rights reserved.
                    </div>
                </div>
                <ul className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid xl:grid-cols-3 gap-x-8 gap-y-3">
                    {links.map((link) => (
                        <li key={link.id} className="flex w-fit group text-base xl:text-h7 2xl:text-h6">
                            {link.id === 2 || link.id === 4 ? (
                                <Link className="group" href={link.href} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                </Link>
                            ) : (
                                <Link className="group" href={link.href}>
                                    {link.label}
                                </Link>
                            )}
                            <span className="relative overflow-hidden h-fit w-fit">
                                <ArrowUpRight
                                    className="group-hover:-translate-y-5 group-hover:translate-x-5 duration-500 transition-transform ease-in-out-circ fill-light-gray "
                                    color="gray"
                                />
                                <ArrowUpRight
                                    className="absolute top-0 group-hover:translate-x-0 duration-500 group-hover:translate-y-0 transition-all ease-in-out-circ translate-y-5 -translate-x-5 fill-light-gray "
                                    color="gray"
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
}
