import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import React from 'react';

interface ShareModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const ShareProductModal: React.FC<ShareModalProps> = ({ visible, setVisible, children }) => {
    return (
        <Dialog open={visible} onOpenChange={setVisible} >
            <DialogContent className="bg-white">

                {children}

            </DialogContent>
        </Dialog>
    );
};

export default ShareProductModal;
