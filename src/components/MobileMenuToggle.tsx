// MobileMenuToggle.tsx
'use client';

import { Menu, X } from "lucide-react";
import React, { useState } from 'react';

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { NavbarRoutes } from "./routes/navbar-routes";
import RightNavContent from "./RightNavContent";
import SearchBar from "./SearchBar";
import { useSession } from "next-auth/react";

const MobileMenuToggle = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
            </button>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-[#2D3339] shadow-lg md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <div className="mb-3">
                            <SearchBar />
                        </div>
                        <NavbarRoutes />
                        {session?.user?.email && <RightNavContent />}
                        {!session?.user && (
                            <Link href="/sign-in" passHref className="block mt-4">
                                <Button variant="outline" size="sm" className="w-full text-gray-100 border-gray-500 hover:bg-gray-700">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileMenuToggle;
