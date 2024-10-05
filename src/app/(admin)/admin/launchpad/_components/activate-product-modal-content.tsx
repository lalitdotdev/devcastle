import { CheckCircle } from "lucide-react";
import { activateProduct } from "@/lib/launchpad-server-actions/server-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ActivateProductModalContentProps {
    currentProduct: any;
    closeModal: () => void;
}

const ActivateProductModalContent: React.FC<
    ActivateProductModalContentProps
> = ({ currentProduct, closeModal }) => {
    const router = useRouter();

    const handleActivateButton = async () => {
        try {
            await activateProduct(currentProduct.id);

            toast(
                <>
                    <div className="flex items-center gap-4 mx-auto">
                        <CheckCircle className="text-green-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Product activated successfully
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            closeModal();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-full">
            <div>

                <p className="text-gray-500 mb-4">
                    Are you sure you want to activate this product ?
                </p>

                <p className="pb-10 text-gray-500">
                    Once activated, the product will be visible to the public and users
                    will be able to interact with it
                </p>

                <button
                    onClick={handleActivateButton}
                    className=" text-emerald-500 hover:underline"
                >
                    Click here to activate
                </button>
            </div>
        </div>
    );
};

export default ActivateProductModalContent;
