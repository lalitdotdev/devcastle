import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-white">
                <div className="fixed inset-0 z-50 transition-opacity bg-black bg-opacity-75 backdrop-filter backdrop-blur" />
                <div className="relative h-full xl:h-[600px] w-full mt-auto sm:mt-0 sm:w-[650px] flex bg-white rounded-sm shadow-md">
                    <DialogTrigger asChild>
                        <button
                            onClick={() => setVisible(false)}
                            className="absolute top-4 right-4 hover:opacity-70 focus:outline-none"
                        >
                            <X className="w-5 h-5" aria-hidden="true" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogTrigger>
                    <div className="flex justify-center flex-col flex-1 px-8 py-10 text-left rounded-t-md">
                        {children}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
