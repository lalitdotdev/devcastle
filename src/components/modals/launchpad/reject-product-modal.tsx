import { Dialog, DialogContent } from "@/components/ui/dialog";

import React from 'react';
import { XCircle } from 'lucide-react';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const RejectProductModal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent className="sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw] h-[80vh] bg-gradient-to-br from-red-900 to-gray-900 text-white rounded-lg border border-red-800 shadow-2xl">
                <div className="absolute right-4 top-4">
                    {/* <DialogTrigger asChild>
                        <button
                            onClick={() => setVisible(false)}
                            className="rounded-full p-2 bg-red-800 opacity-80 transition-all hover:opacity-100 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogTrigger> */}
                </div>
                <div className="overflow-auto flex justify-center flex-col flex-1 px-6 py-8 text-left space-y-4">
                    <div className="flex gap-4 items-center">
                        <XCircle
                            className="text-red-500
            text-5xl mb-4 bg-red-300 p-1
            rounded-md"
                            size={40}
                        />

                        <h2 className="text-3xl font-bold text-red-400 mb-4">Reject Product</h2>
                    </div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RejectProductModal;
