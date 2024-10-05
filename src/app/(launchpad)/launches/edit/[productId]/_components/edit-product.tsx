"use client";

import EditProductForm from "./editProductForm";
import EditProductModal from "@/components/modals/edit-product-modal";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface EditProductProps {
    product: any;
}

const EditProduct: React.FC<EditProductProps> = ({
    product
}) => {
    const [editProductModalVisible, setEditProductModalVisible] = useState(false);

    const handleEditProductClick = () => {
        setEditProductModalVisible(true);
    };

    return (
        <>
            <button
                onClick={handleEditProductClick}
                className="bg-emerald-100 p-4 rounded-md
    flex items-center justify-center cursor-pointer"
            >
                <Pencil className="text-xl text-emerald-500" />
            </button>

            <EditProductModal visible={editProductModalVisible}
                setVisible={setEditProductModalVisible}>
                <EditProductForm product={product} />
            </EditProductModal>
        </>
    );
};

export default EditProduct;
