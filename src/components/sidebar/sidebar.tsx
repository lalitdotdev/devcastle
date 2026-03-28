"use client"

import { AnimatePresence as _AnimatePresence, motion } from 'framer-motion';
const AnimatePresence = _AnimatePresence as any;
import { ChevronRight, HelpCircle, PersonStanding, Rocket, Settings } from 'lucide-react';
import React, { useState } from 'react';

import Link from 'next/link';
import { SidebarRoutes } from './sidebar-routes';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Trigger Button - More cohesive and attached to sidebar edge when open */}
            <motion.button
                onClick={toggleSidebar}
                initial={false}
                animate={{ 
                    left: isOpen ? "108px" : "12px",
                    rotate: isOpen ? 180 : 0,
                    scale: isOpen ? 1 : 1.1
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                    "fixed top-[100px] z-[110] flex items-center justify-center w-8 h-8 rounded-full border shadow-lg transition-colors duration-200",
                    isOpen 
                        ? "bg-[#1B1F23] border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500" 
                        : "bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500"
                )}
            >
                <ChevronRight size={16} />
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
                <motion.aside
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ 
                        x: isOpen ? 0 : -80,
                        opacity: 1,
                        width: isOpen ? "96px" : "80px"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "fixed top-24 bottom-6 left-4 z-50 flex flex-col bg-[#1B1F23]/90 backdrop-blur-xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden transition-colors duration-500",
                        !isOpen && "border-transparent bg-transparent shadow-none pointer-events-none"
                    )}
                >
                    <div className={cn(
                        "flex flex-col h-full w-full py-6 px-3 transition-opacity duration-300",
                        !isOpen && "opacity-0"
                    )}>
                        {/* Top Section / Logo placeholder */}
                        <div className="flex justify-center mb-8">
                             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                                 <div className="w-full h-full bg-[#1B1F23] rounded-[14px] flex items-center justify-center">
                                     <Rocket size={20} className="text-indigo-400" />
                                 </div>
                             </div>
                        </div>

                        {/* Navigation Section */}
                        <nav className="flex-1 flex flex-col items-center gap-y-4 custom-scrollbar overflow-y-auto">
                            <SidebarRoutes />
                        </nav>

                        {/* Bottom Utility Items */}
                        <div className="mt-auto pt-6 flex flex-col items-center gap-y-6 border-t border-zinc-800/50">
                            <motion.div whileHover={{ scale: 1.1, color: "#818cf8" }} className="text-zinc-400 transition-colors">
                                <Link href="/launchpad/settings" onClick={() => setIsOpen(false)}>
                                    <Settings size={22} />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1, color: "#818cf8" }} className="text-zinc-400 transition-colors">
                                <Link href="/admin" onClick={() => setIsOpen(false)}>
                                    <PersonStanding size={24} />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1, color: "#818cf8" }} className="text-zinc-400 transition-colors">
                                <Link href="/help" onClick={() => setIsOpen(false)}>
                                    <HelpCircle size={22} />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Overlay for mobile only */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
