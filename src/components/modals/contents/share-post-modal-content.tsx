import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Share2, X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useMediaQuery } from "@/hooks/use-media-query";

interface ShareModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentProduct: any;
    postId: string;
}

const SharePostModal = ({ visible, setVisible, currentProduct, postId }: ShareModalProps) => {
    const [copiedText, setCopiedText] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const urlPrefix = `${process.env.NEXT_PUBLIC_BASE_URL}/cb/${currentProduct.communityId}/`;

    useEffect(() => {
        setCopiedText(urlPrefix + postId);
    }, [postId, urlPrefix]);

    const handleCopy = () => {
        navigator.clipboard.writeText(copiedText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const socialLinks = [
        { name: 'Twitter', icon: '/logo/twitter-logo.png', url: currentProduct.twitter },
        { name: 'Facebook', icon: '/logo/fb-logo.webp', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(copiedText)}` },
        { name: 'Reddit', icon: '/logo/reddit-logo.png', url: `https://reddit.com/submit?url=${encodeURIComponent(copiedText)}&title=${encodeURIComponent(currentProduct.title)}` },
        { name: 'Discord', icon: '/logo/discord-logo.png', url: currentProduct.discord },
    ];

    const shareContent = (
        <div className="p-4 md:p-6 space-y-6 border-none">
            <div className="mb-6">
                <p className="text-gray-400 mb-3">Share this post on your favorite platform:</p>
                <div className="grid grid-cols-4 gap-4">
                    {socialLinks.map((link) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center"
                        >
                            <Image src={link.icon} alt={link.name} className="w-10 h-10 mb-2 rounded-full bg-white p-2" width={50} height={50} />
                            <span className="text-xs text-gray-300">{link.name}</span>
                        </motion.a>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="share-link" className="block text-sm font-medium text-gray-300 mb-2">
                    Or copy the link:
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        name="share-link"
                        id="share-link"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-gray-200 text-sm"
                        value={copiedText}
                        readOnly
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {isCopied ? <Check size={18} /> : <Copy size={18} />}
                        <span className="ml-2">{isCopied ? 'Copied!' : 'Copy'}</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <Dialog open={visible} onOpenChange={setVisible}>
                <DialogContent className="sm:max-w-lg bg-[#2C353D] text-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center">
                            <Share2 className="mr-2" /> Share this post
                        </h2>

                    </div>
                    {shareContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <AnimatePresence>
            {visible && (
                <Drawer open={visible} onOpenChange={setVisible}>
                    <DrawerContent className="bg-[#2C353D] text-white border-teal-800">
                        <DrawerHeader>
                            <DrawerTitle className="text-2xl font-bold flex items-center">
                                <Share2 className="mr-2" /> Share this post
                            </DrawerTitle>
                            <DrawerDescription className="text-gray-400">
                                Share this amazing content with your network
                            </DrawerDescription>
                        </DrawerHeader>
                        {shareContent}
                        <DrawerFooter>
                            <Button variant="outline" onClick={() => setVisible(false)}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </AnimatePresence>
    );
};

export default SharePostModal;
