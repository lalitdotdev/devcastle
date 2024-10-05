'use client';

import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { BaggageClaim, Briefcase, CassetteTape, Castle, Folder, MessageCircle, WalletCards } from 'lucide-react';
import React, { Suspense, useEffect, useRef, useState } from 'react';

import JobSuggestions from './RightAside/JobSuggestions';
import RightAside from './RightAside/RightAside';
import SearchBar from './SearchBar';
import { cn } from '@/lib/utils';
import useMeasure from 'react-use-measure';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

const transition = {
    type: 'spring',
    bounce: 0.1,
    duration: 0.25,
};





const ITEMS = [
    {
        id: 1,
        label: 'Active Communities',
        title: <CassetteTape className='h-5 w-5' />,
        content: (
            <div className='flex flex-col space-y-4 w-full'>
                <div className='flex flex-col space-y-1 text-gray-400'>
                    <div className='h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-400' />
                    <span>Communities</span>

                </div>

                <Suspense fallback={
                    <div className='h-8 w-full rounded-lg bg-gradient-to-br from-indigo-500 to-blue-400 animate-pulse' />

                }>

                    {/* @ts-expect-error Server Component */}
                    <RightAside />

                </Suspense>



            </div>
        ),
    },
    {
        id: 2,
        label: 'Messages',
        title: <MessageCircle className='h-5 w-5' />,
        content: (
            <div className='flex flex-col space-y-4'>
                <div className='text-gray-400'>Search Communities.</div>
                {/* <button
                    className='relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]'
                    type='button'
                >
                    View more

                </button> */}
                <SearchBar />
            </div>
        ),
    },
    {
        id: 3,
        label: 'Documents',
        title: <Briefcase className='h-5 w-5' />,
        content: (
            <div className='flex flex-col space-y-4 w-full'>
                <div className='flex flex-col space-y-1 text-gray-300'>
                    <div className='h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-400' />
                    <span>
                        Latest Opportunities
                    </span>

                </div>

                <Suspense fallback={
                    <div className='h-8 w-full rounded-lg bg-gradient-to-br from-indigo-500 to-blue-400 animate-pulse' />

                }>

                    {/* @ts-expect-error Server Component */}
                    <JobSuggestions />

                </Suspense>

            </div>
        ),
    },
    {
        id: 4,
        label: 'Wallet',
        title: <WalletCards className='h-5 w-5' />,
        content: (
            <div className='flex flex-col space-y-4'>
                <div className='flex flex-col text-zinc-700'>
                    Testing
                </div>
                <button
                    className='relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]'
                    type='button'
                >
                    View more
                </button>
            </div>
        ),
    },
];

export default function ToolbarExpandable() {
    const [active, setActive] = useState<number | null>(null);
    const [contentRef, { height: heightContent }] = useMeasure();
    const [menuRef, { width: widthContainer }] = useMeasure();
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState(0);

    useOnClickOutside(ref, () => {
        setIsOpen(false);
        setActive(null);
    });

    useEffect(() => {
        if (!widthContainer || maxWidth > 0) return;

        setMaxWidth(widthContainer);
    }, [widthContainer, maxWidth]);




    return (
        <MotionConfig transition={transition}>
            <div className='w-full bg-[#212329] rounded-t-3xl border border-slate-600 md:static fixed bottom-0 left-0 right-0 md:rounded-3xl md:rounded-b-3xl sm:max-w-md' ref={ref}>
                <div className='h-full w-full'>
                    <div className='flex space-x-4 p-2 md:space-x-0 gap-2 justify-end md:justify-start' ref={menuRef}>
                        {ITEMS.map((item) => (
                            <button
                                key={item.id}
                                aria-label={item.label}
                                className={cn(
                                    'relative h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] flex',
                                    active === item.id ? 'bg-emerald-200 text-zinc-800' : ''
                                )}
                                type='button'
                                onClick={() => {
                                    if (!isOpen) setIsOpen(true);
                                    if (active === item.id) {
                                        setIsOpen(false);
                                        setActive(null);
                                        return;
                                    }
                                    setActive(item.id);
                                }}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                    <div className='md:static absolute bottom-full left-0 right-0'>
                        <AnimatePresence initial={false} mode='sync'>
                            {isOpen && (
                                <motion.div
                                    key='content'
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-[#212329] md:rounded-3xl rounded-t-3xl border border-slate-600 md:border-t-0 overflow-hidden'
                                >
                                    <motion.div
                                        ref={contentRef}
                                        className='p-2 md:max-h-none max-h-[60vh] overflow-y-auto'
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        exit={{ y: '100%' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {ITEMS.map((item) => {
                                            const isSelected = active === item.id;
                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: isSelected ? 1 : 0 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <div
                                                        className={cn(
                                                            'px-2 pt-2 text-sm',
                                                            isSelected ? 'block' : 'hidden'
                                                        )}
                                                    >
                                                        {item.content}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
}
