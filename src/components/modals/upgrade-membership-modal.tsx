import { Dialog, DialogContent } from '@/components/ui/dialog';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const MembershipModal: React.FC<ModalProps> = ({ visible, setVisible, children }) => {
    return (
        <Dialog open={visible} onOpenChange={setVisible}>
            <DialogContent className="sm:max-w-[650px] h-full xl:h-[500px] p-0 bg-gray-800">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setVisible(false)}
                        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                <div className="flex flex-col flex-1 px-8 py-10 text-left">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MembershipModal;
