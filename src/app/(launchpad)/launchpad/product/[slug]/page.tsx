import { ArrowLeft, MessageCircle, Tag } from 'lucide-react';

import CarouselComponent from "@/components/launchpad/product-image-carousel";
import GoToWebsite from "./_components/go-to-website";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/launchpad-server-actions/server-actions";

interface IParams {
    slug: string;
}

const ProductPage = async ({ params }: { params: IParams }) => {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center p-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-100 mb-4">Product Not Found</h1>
                    <p className="text-gray-400">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/"
                        className="mt-8 inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold
                        hover:bg-emerald-500 transition-all duration-300 hover:-translate-y-0.5
                        hover:shadow-lg hover:shadow-emerald-500/20">
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    const productImageUrls = product.images.map((image: any) => image.url);

    return (
        <div className="min-h-screen  px-4 py-8 animate-fade-in">
            <Link href='/launchpad'>
                <div className='group flex items-center gap-3 text-sm text-gray-400 hover:text-emerald-400
                    transition-colors duration-300 mb-6 w-fit'>
                    <ArrowLeft className='w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1' />
                    <span className="font-medium">Back to Launchpad</span>
                </div>
            </Link>

            <div className="relative border border-gray-800 bg-gray-900/50 backdrop-blur-sm max-w-7xl mx-auto p-8
                shadow-2xl rounded-2xl  transition-all duration-500
                before:absolute before:inset-0 before:-z-10 before:rounded-2xl
                before:bg-gradient-to-r before:from-emerald-500/10 before:to-blue-500/10 before:blur-xl">
                <div className="p-6 space-y-12">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center">
                            <div className="relative group">
                                <Image
                                    src={product.logo}
                                    alt={product.name}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-xl object-cover shadow-lg ring-2 ring-emerald-500/20
                                        transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20
                                    rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="ml-6">
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r
                                    from-emerald-400 to-blue-400 hover:from-emerald-300 hover:to-blue-300
                                    transition-all duration-300">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-gray-400 mt-2 hover:text-gray-300 transition-colors duration-300">
                                    {product.headline}
                                </p>
                            </div>
                        </div>
                        <GoToWebsite website={product.website} />
                    </div>

                    {/* About Section */}
                    <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700/50 hover:border-gray-700
                        transition-colors duration-300 shadow-lg">
                        <h2 className="text-xl font-semibold text-emerald-400 mb-4">About</h2>
                        <p className="text-gray-300 leading-relaxed hover:text-gray-200 transition-colors duration-300">
                            {product.description}
                        </p>
                    </div>

                    {/* Categories Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-emerald-400 mb-4">Categories</h2>
                        <div className="flex flex-wrap gap-3">
                            {product.categories.map((category: any) => (
                                <Link
                                    href={`/launchpad/category/${category.name.toLowerCase()}`}
                                    key={category.id}
                                    className="group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                                        bg-gray-800/50 text-emerald-400 border border-emerald-500/20
                                        hover:bg-gray-800 hover:border-emerald-500/40 hover:-translate-y-0.5
                                        transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                                >
                                    <Tag className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Product Showcase Section */}
                    <div className="px-4 sm:px-12">
                        <h2 className="text-xl font-semibold text-emerald-400 mb-6">Product Showcase</h2>
                        <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-700/50
                            hover:ring-emerald-500/20 transition-all duration-300">
                            <CarouselComponent productImages={productImageUrls} />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-emerald-400 mb-6 flex items-center">
                            <MessageCircle className="w-6 h-6 mr-2" />
                            Community Feedback
                        </h2>

                        {product.comments.length > 0 ? (
                            <div className="space-y-6">
                                {product.comments.map((comment: any) => (
                                    <div
                                        key={comment.id}
                                        className="group bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50
                                            transition-all duration-300 border border-gray-700/50
                                            hover:border-gray-700 hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-start">
                                            <div className="relative">
                                                <Image
                                                    src={comment.user.image}
                                                    alt={comment.user.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full ring-2 ring-emerald-500/20
                                                        transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10
                                                    to-blue-500/10 rounded-full blur opacity-0
                                                    group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-emerald-400 group-hover:text-emerald-300
                                                    transition-colors duration-300">
                                                    {comment.user.name}
                                                </h3>
                                                <p className="mt-1 text-gray-300 group-hover:text-gray-200
                                                    transition-colors duration-300">
                                                    {comment.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700/50
                                hover:bg-gray-800/50 hover:border-gray-700 transition-all duration-300">
                                <h3 className="text-lg font-medium text-emerald-400">No comments yet</h3>
                                <p className="mt-2 text-gray-400">Be the first to share your thoughts on this product!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
