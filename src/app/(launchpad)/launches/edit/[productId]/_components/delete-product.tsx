"use client"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from 'react';
import { Store, Trash } from "lucide-react";

import { deleteProduct } from "@/lib/launchpad-server-actions/server-actions";
import { useRouter } from "next/navigation";

interface DeleteProductProps {
    productId: string;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ productId }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState("");
    const isDeleteButtonEnabled = confirmationInput.toLowerCase() === "delete"; // This is the condition that enables the delete button to be clicked and delete the product from the database and server

    const handleConfirmDelete = async () => {
        if (isDeleteButtonEnabled) {
            try {
                await deleteProduct(productId);
                router.push("/launchpad/my-products");
                router.refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsOpen(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="cursor-pointer bg-red-100 p-4 rounded-md">
                    <Trash className="text-xl text-red-500" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-red-900 to-gray-900 text-white rounded-lg border border-red-800 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <Store className="text-red-500 mb-4 text-4xl bg-red-100 p-2 rounded-full h-10 w-10" />
                    <h2 className="text-xl font-semibold mb-4">Delete Product</h2>
                    <p className="text-sm mb-4">
                        We&apos;re sorry to see you go. Once your product is deleted, all of
                        your content will be permanently gone, including your products and
                        product settings.
                    </p>
                    <p className="text-sm mb-4">
                        This action cannot be undone. This will permanently delete your
                        product and all of your content.
                    </p>
                    <p className="text-sm font-medium">To confirm deletion, type <span className="font-semibold text-emerald-300">delete</span> below:</p>
                    <input
                        type="text"
                        className="border border-red-600 w-full p-2 rounded-md mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-800 text-white"
                        value={confirmationInput}
                        onChange={(e) => setConfirmationInput(e.target.value)}
                    />
                    <div className="flex justify-end w-full space-x-2">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isDeleteButtonEnabled
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gray-300 cursor-not-allowed"
                                }`}
                            disabled={!isDeleteButtonEnabled} // This is the condition that disables the delete button if the confirmation input is not "delete"
                            onClick={handleConfirmDelete} // This is the function that deletes the product from the database and server
                        >
                            Confirm delete
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteProduct;
