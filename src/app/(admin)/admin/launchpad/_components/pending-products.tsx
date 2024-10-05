"use client";

import { CheckCircle, Eye, XCircle } from "lucide-react";

import ActivateProductModal from "@/components/modals/launchpad/activate-product-modal";
import ActivateProductModalContent from "./activate-product-modal-content";
import Image from "next/image";
import ProductModal from "@/components/modals/launchpad/product-modal";
import ProductModalContent from "@/components/modals/contents/product-modal-content";
import RejectProductModal from "@/components/modals/launchpad/reject-product-modal";
import RejectProductModalContent from "@/app/(admin)/admin/launchpad/_components/reject-product-modal-content";
import { useState } from "react";

interface PendingProductsProps {
    pendingProducts: any;
    authenticatedUser: any;
}

const PendingProducts: React.FC<PendingProductsProps> = ({
    pendingProducts,
    authenticatedUser,
}) => {
    const [currentProduct, setCurrentProduct] = useState<any>(null);

    const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
    const [activateProductModalVisible, setActivateProductModalVisible] =
        useState(false);
    const [rejectProductModalVisible, setRejectProductModalVisible] =
        useState(false);

    const formattedProducts = pendingProducts?.map((product: any) => {
        const {
            id,
            name,
            slug,
            headline,
            description,
            logo,
            releaseDate,
            website,
            twitter,
            discord,
            createdAt,
            updatedAt,
            userId,
            status,
            images,
            categories,
        } = product;

        // Extract image urls and category names
        const imageUrls = images.map((image: any) => image.url);

        // Extract category names
        const categoryNames = categories.map((category: any) => category.name);

        return {
            id,
            name,
            slug,
            headline,
            description,
            logo,
            releaseDate,
            website,
            twitter,
            discord,
            createdAt,
            updatedAt,
            userId,
            status,
            images: imageUrls,
            categories: categoryNames,
        };
    });

    console.log(formattedProducts, "formatted products here");

    const handleViewProductModal = (product: any) => {
        const formattedProduct = formattedProducts.find(
            (formattedProduct: any) => formattedProduct.id === product.id
        );
        setCurrentProduct(formattedProduct);
        setViewProductModalVisible(true);
    };

    const handleActivateProductModal = (product: any) => {
        setCurrentProduct(product);
        setActivateProductModalVisible(true);
    };

    const handleRejectProductModal = (product: any) => {
        setCurrentProduct(product);
        setRejectProductModalVisible(true);
    };

    return (
        <div className="">
            <div className="flex flex-col w-full my-6 gap-4 ">
                {formattedProducts?.map((product: any) => (
                    <div
                        key={product.id}
                        className="flex  rounded-md p-4 justify-between items-center text-white border border-l-4 border-teal-400 bg-gray-800 "
                    >
                        <div className="flex gap-x-6 items-center">
                            <Image
                                src={product.logo}
                                alt="logo"
                                width={200}
                                height={200}
                                className="w-10 md:w-20 rounded-md cursor-pointer"
                            />

                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-100">{product.name} </h1>
                                <p className="hidden md:flex text-gray-500 text-sm pr-6">
                                    {product.description}
                                </p>
                                <div className="hidden md:flex text-gray-500 font-semibold">
                                    Release Date : {product.releaseDate}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-x-4 justify-center">
                            <button
                                onClick={() => handleViewProductModal(product)}
                                className="bg-[#ff6154]
                 text-white px-4 py-2 text-center
                  text-sm  rounded-md flex items-center gap-2"
                            >
                                View Product <Eye className="text-xl text-white" />
                            </button>

                            <button
                                onClick={() => handleActivateProductModal(product)}
                                className="bg-emerald-100 text-white
                         px-4 py-2 text-center text-sm rounded-md"
                            >
                                <CheckCircle className="text-xl text-emerald-500" />
                            </button>

                            <button
                                onClick={() => handleRejectProductModal(product)}
                                className="bg-red-100 text-white
                px-4 py-2 text-center text-sm rounded-md"
                            >
                                <XCircle className="text-xl text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}

                <ProductModal
                    visible={viewProductModalVisible}
                    setVisible={setViewProductModalVisible}
                >
                    <ProductModalContent
                        currentProduct={currentProduct}
                        authenticatedUser={authenticatedUser}
                        hasUpvoted={false}
                        totalUpvotes={0}
                        setTotalUpvotes={() => { }}
                        setHasUpvoted={() => { }}
                    />
                </ProductModal>

                <ActivateProductModal
                    visible={activateProductModalVisible}
                    setVisible={setActivateProductModalVisible}
                >
                    <ActivateProductModalContent
                        currentProduct={currentProduct}
                        closeModal={() => setActivateProductModalVisible(false)}
                    />
                </ActivateProductModal>

                <RejectProductModal
                    visible={rejectProductModalVisible}
                    setVisible={setRejectProductModalVisible}
                >
                    <RejectProductModalContent
                        currentProduct={currentProduct}
                        closeModal={() => setRejectProductModalVisible(false)}
                    />
                </RejectProductModal>
            </div>
        </div>
    );
};

export default PendingProducts;
