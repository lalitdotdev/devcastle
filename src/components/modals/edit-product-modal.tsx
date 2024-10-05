import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const EditProductModal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent className="sm:max-w-[1500px] h-[90vh] bg-gray-800 text-white ">
                <div className="absolute right-4 top-4">
                    <DialogTrigger asChild>
                        <button
                            onClick={() => setVisible(false)}
                            className="rounded-sm opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-purple-600 data-[state=open]:text-muted-foreground justify-center items-center"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogTrigger>
                </div>
                <div className="overflow-auto flex justify-center flex-col flex-1 px-6 py-8 text-left  ">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductModal;
