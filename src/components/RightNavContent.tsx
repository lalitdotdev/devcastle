"use client";

import { Backpack, BrainCog, Feather, Plus, Rocket, Terminal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "./ui/DropdownMenu";

import Link from "next/link";
import MembershipModal from "./modals/upgrade-membership-modal";
import UpgradeMembership from "./launchpad/upgrade-membership";
import { cn } from "@/lib/utils";
import { isUserPremium } from "@/lib/launchpad-server-actions/server-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RightNavContentProps {
    products?: any;
    authenticatedUser?: any;
}

const RightNavContent = ({ products, authenticatedUser }: RightNavContentProps) => {

    const router = useRouter();

    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

    const handleClick = async () => {
        const isPremium = await isUserPremium()
        if (!isPremium && products.length === 2) {
            setIsUpgradeModalVisible(true);
        } else {
            router.push("/launchpad/new-product");
        }
    };

    return (
        <div className="flex-shrink-0 md:items-center gap-4">
            <div className="text-gray-400 ">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="relative flex items-center justify-center  rounded-md transition-transform duration-300 ease-in-out gap-2 border border-zinc-700 cursor-pointer p-1 hover:bg-gray-800 hover:border-gray-600 transform hover:scale-105">
                            <Terminal size={20} className="text-gray-500" />
                            <span>
                                <Plus size={18} className="text-gray-500 " />
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-800 text-gray-400 border border-gray-600 rounded-xl p-2 transition-transform duration-300 ease-in-out shadow-lg">
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/cb/create" className={cn("flex items-center gap-2")}>
                                <Plus size={20} className="text-lime-500" />
                                <span>New Castle</span>
                                <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/courses/new" className={cn("flex items-center gap-2")}>
                                <BrainCog size={22} className="text-lime-500" />
                                <span>New thought?</span>
                                <DropdownMenuShortcut>Ctrl+T</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/articles/publish" className={cn("flex items-center gap-2")}>
                                <Feather size={22} className="text-lime-500" />
                                New Article
                                <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <button onClick={handleClick} className={cn("flex items-center gap-2 w-full")}>
                                <Rocket size={22} className="text-lime-500" />
                                <span>New Product</span>
                                <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>

                                <MembershipModal
                                    visible={isUpgradeModalVisible}
                                    setVisible={setIsUpgradeModalVisible}
                                >
                                    <UpgradeMembership authenticatedUser={authenticatedUser} />
                                </MembershipModal>
                            </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:text-gray-100" asChild>
                            <Link href="/jobs/new" className={cn("flex items-center gap-2")}>
                                <Backpack size={22} className="text-lime-500" />
                                Post a Job
                                <DropdownMenuShortcut>Ctrl+J</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default RightNavContent;
