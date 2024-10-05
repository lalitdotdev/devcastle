"use client";

import Logo from "./logo";
import Menu from "./menu";
import Search from "./search";
import { Separator } from "@/components/ui/separator";

interface NavbarProps {
    authenticatedUser?: any;
    notifications?: any;
    products?: any;
}

const LaunchPadNavbar: React.FC<NavbarProps> = ({
    authenticatedUser,
    notifications,
    products,
}) => {


    return (
        <div className="py-2 md:py-0 px-4 md:px-6  rounded-b-3xl w-full backdrop-filter backdrop-blur-3xl border-slate-600 my-8">
            <div className="flex relative items-center justify-between  bg-teal-900">
                <div className="flex items-center z-[999] absolute left-0">
                    <Search />
                </div>


            </div>
            <Separator className="bg-zinc-600 my-8 rounded-lg" />

        </div>
    );
};

export default LaunchPadNavbar;
