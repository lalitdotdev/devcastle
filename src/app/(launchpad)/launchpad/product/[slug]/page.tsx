import { MessageCircle, Tag } from 'lucide-react';

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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
                    <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/" className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    const productImageUrls = product.images.map((image: any) => image.url);

    return (
        <div className="  min-h-screen  ">
            <div className="border border-gray-700 max-w-7xl mx-auto sm:px-16 py-12 lg:pl-8 shadow-lg rounded-xl">
                <div className=" rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <Image
                                    src={product.logo}
                                    alt={product.name}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-lg object-cover shadow-md"
                                />
                                <div className="ml-6">
                                    <h1 className="text-3xl font-bold text-emerald-200  ">{product.name}</h1>
                                    <p className="text-lg text-gray-400 mt-2">{product.headline}</p>
                                </div>
                            </div>
                            <GoToWebsite website={product.website} />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold  mb-4">About</h2>
                            <p className="text-gray-400 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold  mb-4">Categories</h2>
                            <div className="flex flex-wrap gap-2">
                                {product.categories.map((category: any) => (
                                    <Link
                                        href={`/launchpad/category/${category.name.toLowerCase()}`}
                                        key={category.id}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition duration-300"
                                    >
                                        <Tag className="w-4 h-4 mr-2" />
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-xl font-semibold  mb-4">Product Showcase</h2>
                            <CarouselComponent productImages={productImageUrls} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold  mb-6 flex items-center">
                                <MessageCircle className="w-6 h-6 mr-2" />
                                Community Feedback
                            </h2>

                            {product.comments.length > 0 ? (
                                <div className="space-y-6">
                                    {product.comments.map((comment: any) => (
                                        <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                                            <div className="flex items-start">
                                                <Image
                                                    src={comment.user.image}
                                                    alt={comment.user.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                                <div className="ml-4">
                                                    <h3 className="font-semibold text-gray-900">{comment.user.name}</h3>
                                                    <p className="mt-1 text-gray-700">{comment.body}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-700 rounded-lg p-6 text-center">
                                    <h3 className="text-lg font-medium text-emerald-200">No comments yet</h3>
                                    <p className="mt-2 text-gray-500">Be the first to share your thoughts on this product!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
