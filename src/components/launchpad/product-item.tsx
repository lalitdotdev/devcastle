"use client";

import { ArrowBigUp, CornerUpRight, MessageCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import ProductModal from "../modals/launchpad/product-modal";
import ProductModalContent from "../modals/contents/product-modal-content";
import { motion } from "framer-motion";
import { upvoteProduct } from "@/lib/launchpad-server-actions/server-actions";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useState } from "react";

interface ProductItemProps {
    product: any;
    authenticatedUser: any;
}

const ProductItem: React.FC<ProductItemProps> = ({
    product,
    authenticatedUser,
}) => {
    const [showProductModal, setShowProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [hasUpvoted, setHasUpvoted] = useState(
        product.upvoters?.includes(authenticatedUser?.user.id)
    );
    const { loginToast } = useCustomToast();
    const [totalUpvotes, setTotalUpvotes] = useState(product.upvotes || 0);

    const handleProductItemClick = () => {
        if (!authenticatedUser) {
            return loginToast();
        } else {
            setCurrentProduct(product);
            setShowProductModal(true);
        }
    };

    const handleArrowClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        window.open(`${product.website}`, "_blank");
    };

    const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();
    };

    const handleUpvoteClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        try {
            await upvoteProduct(product?.id);
            setHasUpvoted(!hasUpvoted);
            setTotalUpvotes(hasUpvoted ? totalUpvotes - 1 : totalUpvotes + 1);
        } catch (error) {
            console.error(error);
        }
    }

    const releaseDate = product.releaseDate && new Date(product.releaseDate);
    const currentDate = new Date();
    let displayReleaseDate = releaseDate > currentDate ? releaseDate.toDateString() : "Available Now";

    return (
        <motion.div
            onClick={handleProductItemClick}
            className="w-full cursor-pointer p-4 rounded-md  text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out sm:border-l-4 border-emerald-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Image
                            src={product.logo}
                            alt="logo"
                            width={48}
                            height={48}
                            className="rounded-md"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-lg font-bold text-emerald-200">{product.name}</h1>
                        <p className="text-sm text-gray-300">{product.headline}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="text-xs text-gray-400 flex items-center space-x-1">
                                <MessageCircle size={12} />
                                <span>{product.commentsLength}</span>
                            </div>
                            {product.categories.map((category: string) => (
                                <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="text-xs text-emerald-300 hover:text-emerald-500 transition-colors duration-200 "
                                    onClick={handleCategoryClick}
                                >
                                    #{category}
                                </Link>
                            ))}
                            <div className="text-xs text-gray-400">{displayReleaseDate}</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <motion.div
                        onClick={handleArrowClick}
                        className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                        whileHover={{ scale: 1.2, rotate: 45 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <CornerUpRight size={20} />
                    </motion.div>
                    <motion.div
                        onClick={handleUpvoteClick}
                        className={`px-3 py-2 rounded-md flex flex-col items-center ${hasUpvoted
                            ? "bg-gradient-to-bl from-[#ff6154] to-[#ff4582] border-[#ff6154]"
                            : "bg-gray-700 hover:bg-gray-600"
                            } transition-colors duration-200`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowBigUp className={`text-xl ${hasUpvoted ? " text-white fill-current" : "text-emerald-200"}`} />
                        <span className={`text-sm font-bold ${hasUpvoted ? "text-white" : "text-emerald-200"}`}>
                            {totalUpvotes}
                        </span>
                    </motion.div>
                </div>
            </div>
            <ProductModal visible={showProductModal} setVisible={setShowProductModal}>
                <ProductModalContent
                    currentProduct={currentProduct}
                    authenticatedUser={authenticatedUser}
                    setTotalUpvotes={setTotalUpvotes}
                    totalUpvotes={totalUpvotes}
                    hasUpvoted={hasUpvoted}
                    setHasUpvoted={setHasUpvoted}
                />
            </ProductModal>
        </motion.div >
    );
};

export default ProductItem;
