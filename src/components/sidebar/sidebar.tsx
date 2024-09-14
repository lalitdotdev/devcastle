"use client"

import { HelpCircle, Home, Menu, PanelRightClose, PanelRightOpen, Settings, X } from 'lucide-react';
import React, { useState } from 'react';

import Image from 'next/image';
import { Separator } from '../ui/separator';
import { SidebarRoutes } from './sidebar-routes';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden top-24 mt-24 left-6 z-50 flex items-center justify-center p-2  text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white rounded-full"
            >
                {isOpen ? <PanelRightClose size={24} className='text-zinc-500' /> : <PanelRightOpen size={24} className='text-zinc-500' />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition duration-200 ease-in-out z-10 w-24 border-r border-zinc-800  bg-[#1B1F23] text-gray-100 flex flex-col shadow-lg mt-24 rounded-r-md`}

            >
                {/* <div className="flex items-center justify-center p-2 "> */}
                {/* <Image
                    src="/logo/logo.png"
                    alt="devcastle"
                    width={60}
                    height={60}
                    className='mx-auto'
                /> */}
                {/* <span className="text-xl ml-2">devcastle</span> */}
                {/* </div> */}

                <nav className="flex-1 overflow-y-auto py-4">
                    <SidebarRoutes />
                </nav>
                <div className="mx-auto border-t border-gray-700 py-6">
                    <ul className="space-y-2">
                        <li>
                            <a href="/settings" className="flex items-center hover:bg-gray-700 rounded p-2 transition-colors duration-200">
                                <Settings size={20} />
                            </a>
                        </li>
                        <li>
                            <a href="/help" className="flex items-center  hover:bg-gray-700 rounded p-2 transition-colors duration-200">
                                <HelpCircle size={20} />
                            </a>
                        </li>
                    </ul>
                </div>
            </div >

            {/* Overlay */}
            {
                isOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )
            }
        </>
    );
};

export default Sidebar;
