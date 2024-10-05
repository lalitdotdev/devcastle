import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { CheckCircle } from 'lucide-react';
import React from 'react';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const ActivateProductModal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent className="sm:max-w-[50vw] lg:max-w-[40vw] xl:max-w-[30vw] 2xl:max-w-[40vw] h-[50vh] bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg border border-gray-700 shadow-2xl ">
                <div className="absolute right-4 top-4">
                    <DialogTrigger asChild>
                        {/* <button
                            onClick={() => setVisible(false)}
                            className="rounded-full p-2 bg-gray-700 opacity-80 transition-all hover:opacity-100 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button> */}
                    </DialogTrigger>
                </div>
                <div className="overflow-auto flex justify-center flex-col flex-1 px-6 py-8 text-left space-y-4">
                    <div className="flex gap-4 items-center">
                        <CheckCircle
                            className="text-green-500
            text-5xl mb-4 bg-green-300 p-1
            rounded-md"
                            size={40}
                        />
                        <h2 className="text-3xl font-bold text-emerald-200 mb-4">Activate Product</h2>

                    </div>

                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ActivateProductModal;
