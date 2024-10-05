"use client";

import { ArrowBigUp, MessageCircle, Trash, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import CarouselComponent from "@/components/launchpad/product-image-carousel";
import Image from "next/image";
import Link from "next/link";
import ShareModal from "../share-product-modal";
import ShareProductModalContent from "./share-product-modal-content";
import { useState } from "react";

interface ProductModalContentProps {
    currentProduct: any;
    authenticatedUser: any;
    totalUpvotes: number;
    hasUpvoted: boolean;
    setTotalUpvotes: any;
    setHasUpvoted: any;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({
    currentProduct,
    authenticatedUser,
    totalUpvotes,
    hasUpvoted,
    setTotalUpvotes,
    setHasUpvoted,
}) => {
    const [commentText, setCommentText] = useState("");

    const [shareModalVisible, setShareModalVisible] = useState(false);

    const [comments, setComments] = useState(currentProduct.commentData || []);

    const handleShareClick = () => {
        setShareModalVisible(true);
    };

    const handleCommentSubmit = async () => {
        console.log('Comment submit handler')
    };

    const handleCommentChange = (event: any) => {
        setCommentText(event.target.value);
    };

    const handleDeleteComment = async (commentId: string) => {
        console.log('Delete comment handler')
    };

    const handleUpvoteClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();

        console.log('Upvote Comment handler')
    }







    return (
        <div className="h-full">
            <div className="md:w-4/5 mx-auto">
                <Image
                    src={currentProduct.logo}
                    alt="logo"
                    width={200}
                    height={200}
                    className="h-20 w-20 border rounded-md bg-white shadow-md"
                />

                <div className="py-4 space-y-2">
                    <h1 className="text-2xl font-semibold">{currentProduct.name}</h1>
                    <div className="md:flex md:justify-between items-center">
                        <p className="text-zinc-300 text-xl font-light md:w-3/5">
                            {currentProduct.headline}
                        </p>

                        <div className="flex items-center gap-2 pt-4">
                            <button
                                onClick={() => window.open(currentProduct.website, "_blank")}
                                className="border rounded-md flex justify-center
                        items-center p-5 cursor-pointer bg-teal-500 text-black"
                            >
                                Visit
                            </button>

                            <button
                                className={`rounded-md border-teal-600 flex justify-center items-center p-5
                gap-x-3 cursor-pointer bg-gradient-to-r w-full xl:w-56 ${hasUpvoted
                                        ? "from-[#ff6154] to-[#ff4582] border-[#ff6154] text-white"
                                        : "text-emerald-50 border"
                                    }`}
                                onClick={handleUpvoteClick}



                            >
                                <ArrowBigUp
                                    className={`text-2xl ${hasUpvoted ? "text-white fill-current" : "text-emerald-100"
                                        }`}
                                    size={28}
                                />
                                {totalUpvotes}
                            </button>
                        </div>
                    </div>
                    <h2 className="text-gray-400 py-6">{currentProduct.description}</h2>

                    <div className="md:flex justify-between items-center">
                        <div className="flex gap-x-2">
                            {currentProduct.categories.map((category: any) => (
                                <Link
                                    href={`/category/${category.toLowerCase()}`}
                                    key={category}
                                    className="bg-teal-400 text-black px-4 py-2 rounded-xl cursor-pointer"
                                >
                                    {category}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-x-4 py-4">
                            <div
                                className="text-md text-gray-400
              flex items-center gap-x-1 cursor-pointer"
                            >
                                <MessageCircle />
                                <p>Discuss</p>
                            </div>

                            <div
                                onClick={handleShareClick}
                                className="text-md text-gray-400
              flex items-center gap-x-1 cursor-pointer"
                            >
                                <Upload />
                                <p>Share</p>
                            </div>
                        </div>
                    </div>

                    <CarouselComponent productImages={currentProduct.images} />

                    <h1 className="font-semibold pt-10">Community Feedback</h1>

                    <div>
                        <div className="w-full flex gap-4 mt-4">
                            <Image
                                src={authenticatedUser.user.image}
                                alt="profile"
                                width={50}
                                height={50}
                                className="rounded-full h-12 w-12"
                            />

                            <textarea
                                value={commentText}
                                onChange={handleCommentChange}
                                placeholder="What do you think about this product?"
                                className="w-full rounded-md p-4
                focus:outline-none text-white bg-gray-700 "
                            />
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCommentSubmit}
                                className="bg-[#ff6154] text-white p-2 rounded-md"
                            >
                                Comment
                            </button>
                        </div>
                    </div>

                    <div className="py-8 space-y-8">
                        {comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-4">
                                <Image
                                    src={comment.profile}
                                    alt="profile"
                                    width={50}
                                    height={50}
                                    className="w-8 h-8 rounded-full mt-1 cursor-pointer"
                                />

                                <div className="w-full">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-x-2 items-center">
                                            <h1 className="text-gray-600 font-semibold cursor-pointer">
                                                {comment.user}
                                            </h1>
                                            {comment.userId === currentProduct.userId && (
                                                <Badge className="bg-[#88aaff]">Creator</Badge>
                                            )}

                                            <div className="text-gray-500 text-xs">
                                                {new Date(comment.timestamp).toDateString()}
                                            </div>
                                        </div>

                                        {(comment.userId === authenticatedUser?.user?.id ||
                                            currentProduct.userId ===
                                            authenticatedUser?.user?.id) && (
                                                <Trash
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-red-500 hover:cursor-pointer"
                                                />
                                            )}

                                    </div>

                                    <div className="text-gray-600 text-sm
                    hover:cursor-pointer mt-2">
                                        {comment.body}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ShareModal
                visible={shareModalVisible}
                setVisible={setShareModalVisible}
            >
                <ShareProductModalContent currentProduct={currentProduct} />
            </ShareModal>
        </div>
    );
};

export default ProductModalContent;
