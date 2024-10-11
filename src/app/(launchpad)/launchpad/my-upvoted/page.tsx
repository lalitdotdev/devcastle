import { ArrowUpCircle, Frown, Vote } from 'lucide-react';

import Image from "next/image";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getUpvotedProducts } from "@/lib/launchpad-server-actions/server-actions";
import { redirect } from "next/navigation";

const MyUpvotedProducts = async () => {
    const authenticatedUser = await getAuthSession();

    if (!authenticatedUser) {
        redirect("/");
    }

    const products = await getUpvotedProducts();

    return (
        <div className="mx-auto md:w-4/5 pt-10 px-6 md:px-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8 py-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                    <h1 className="text-3xl font-extrabold text-zinc-400 sm:text-3xl md:text-4xl ">
                        <Vote className="h-12 w-12 inline-block text-green-500 mr-4" />
                        Your Upvoted Products
                    </h1>
                    <p className="mt-2 max-w-md mx-auto text-base text-zinc-500 sm:text-lg md:mt-5 md:text-md">
                        Discover and revisit the products that caught your interest.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 rounded-lg shadow-sm border border-gray-200">
                        <Frown className="mx-auto h-12 w-12 text-gray-400" />
                        <h2 className="mt-2 text-lg font-medium text-gray-900">No upvoted products yet</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Start exploring and upvoting products to build your collection.
                        </p>
                        <div className="mt-6">
                            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Explore Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product: any) => (
                            <Link href={`/launchpad/product/${product.slug}`} key={product.id} className="group">
                                <div className="bg-gray-800 text-zinc-100 rounded-lg shadow-sm overflow-hidden border border-gray-700 transition-all duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1">
                                    <div className="relative h-48">
                                        <Image
                                            src={product.logo}
                                            alt={product.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-opacity duration-300 group-hover:opacity-75"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-emerald-200 mb-1 truncate">{product.name}</h2>
                                        <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                        <div className="mt-4 flex items-center text-sm text-gray-300">
                                            <ArrowUpCircle className="h-5 w-5 text-green-500 mr-2" />
                                            Upvoted
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyUpvotedProducts;
