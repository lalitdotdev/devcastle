"use client";

import AboutMenu from "./menus/about-menu";
import CommunityMenu from "./menus/community-menu";
import LaunchesMenu from "./menus/launches-menu";
import Link from "next/link";
import { useState } from "react";

const Menu = () => {
    const [showLaunchesMenu, setShowLaunchesMenu] = useState(false);
    const [showCommunityMenu, setShowCommunityMenu] = useState(false);
    const [showAboutMenu, setShowAboutMenu] = useState(false);

    return (
        <div className="hidden lg:flex items-center relative  mt-2">
            <div className="space-x-6 text-gray-300 text-md flex items-center cursor-pointer p-1 px-4">
                <div
                    onMouseEnter={() => setShowLaunchesMenu(true)}
                    onMouseLeave={() => setShowLaunchesMenu(false)}
                    className="hover:text-zinc-100 py-4"
                >
                    Launches {showLaunchesMenu && <LaunchesMenu />}
                </div>

                <Link href={"/categories"} className="hover:text-zinc-100">
                    Categories
                </Link>

                <div
                    onMouseEnter={() => setShowCommunityMenu(true)}
                    onMouseLeave={() => setShowCommunityMenu(false)}
                    className="hover:text-zinc-100 py-4"

                >
                    Community {showCommunityMenu && <CommunityMenu />}
                </div>

                <div className="hover:text-zinc-100 py-4">Advertise</div>

                {/* <div
                    onMouseEnter={() => setShowAboutMenu(true)}
                    onMouseLeave={() => setShowAboutMenu(false)}
                    className="hover:text-zinc-100 py-4"

                >
                    About {showAboutMenu && <AboutMenu />}
                </div> */}
            </div>
        </div>
    );
};

export default Menu;
