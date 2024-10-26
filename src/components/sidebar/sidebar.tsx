"use client"

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, HelpCircle, PersonStanding, Settings } from 'lucide-react';
import React, { useState } from 'react';

import Link from 'next/link';
import { SidebarRoutes } from './sidebar-routes';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const sidebarVariants = {
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    const iconVariants = {
        open: { rotate: 0 },
        closed: { rotate: 180 }
    };

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                onClick={toggleSidebar}
                className="fixed top-20 left-6 z-[100] flex items-center justify-center sm:p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    variants={iconVariants}
                    animate={isOpen ? "open" : "closed"}
                >
                    <ChevronRight size={24} />
                </motion.div>
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
                <motion.div
                    className="fixed inset-y-0 left-0 w-24 bg-gray-800/50  text-white flex flex-col shadow-2xl mt-24 rounded-r-xl overflow-hidden z-50"
                    variants={sidebarVariants}
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                >
                    <nav className="flex-1 overflow-y-auto py-8 px-2">
                        <SidebarRoutes />
                    </nav>
                    <div className="border-t border-gray-700 py-4 px-2">
                        <ul className="space-y-6">
                            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link href="/launchpad/settings" className="flex items-center justify-center hover:text-indigo-300 transition-colors duration-200">
                                    <Settings size={24} />
                                </Link>
                            </motion.li>
                            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link
                                    href="/admin"
                                    className={cn("flex items-center justify-center hover:text-indigo-300 transition-colors duration-200")}
                                >
                                    <PersonStanding size={28} />
                                </Link>
                            </motion.li>
                            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link href="/help" className="flex items-center justify-center hover:text-indigo-300 transition-colors duration-200">
                                    <HelpCircle size={24} />
                                </Link>
                            </motion.li>
                        </ul>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
