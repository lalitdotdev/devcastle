import { Crown, Plus } from "lucide-react";
import { getOwnerProducts, isUserPremium } from "@/lib/launchpad-server-actions/server-actions";

import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { getAuthSession } from "@/lib/auth";
import { useCustomToast } from "@/hooks/use-custom-toast";

const MyProducts = async () => {
    const session = await getAuthSession();
    const { loginToast } = useCustomToast()

    if (!session) {
        return loginToast()
    }

    const products = await getOwnerProducts();
    const isPremium = await isUserPremium();

    return (
        <div className="mx-auto lg:w-3/5 py-10 px-6 animate-fadeIn">
            {products.length === 0 ? (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 animate-slideDown">No products found</h1>
                    <p className="text-gray-500 mb-8 animate-slideUp">
                        Looks like you haven&apos;t created any products yet. Click the button
                        below to get started!
                    </p>
                    <Link href="/launchpad/new-product" className="inline-block">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center">
                            <Plus className="text-4xl mb-2" />
                            <p className="text-lg font-semibold">Create a product</p>
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="space-y-12 py-8 bg-[#1B1F23] text-gray-100">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text animate-gradient">
                            Your Products
                        </h1>
                        <p className="text-xl text-gray-400 animate-fadeIn">
                            Manage your amazing creations here
                        </p>
                    </div>

                    {isPremium ? (
                        <div className="flex items-center justify-center mt-6 bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-xl shadow-lg animate-pulse">
                            <Crown className="text-4xl text-yellow-200 mr-4" />
                            <p className="text-xl font-bold text-yellow-100">You are a premium user</p>
                        </div>
                    ) : (
                        <p className="text-center text-xl text-gray-400 animate-fadeIn bg-gray-800 py-4 rounded-lg">
                            ({products.length} / 2) free products
                        </p>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <Link href={`/launches/edit/${product.id}`} key={product.id}>
                                <div
                                    className="group bg-gray-800 rounded-2xl overflow-hidden shadow-md  transition-all duration-300 transform hover:-translate-y-1 w-52"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-700 opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10"></div>
                                        <Image
                                            src={product.logo}
                                            alt={product.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 ">
                                        <div className="font-semibold text-lg mb-2 text-gray-100 group-hover:text-teal-400 transition-colors duration-300 w-full">{product.name}</div>

                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProducts;
