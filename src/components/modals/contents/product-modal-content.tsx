"use client";

import { ArrowBigUp, MessageCircle, Trash, Upload } from "lucide-react";
import { commentOnProduct, deleteProductComment } from "@/lib/launchpad-server-actions/server-actions";

import { Badge } from "@/components/ui/badge";
import CarouselComponent from "@/components/launchpad/product-image-carousel";
import Image from "next/image";
import Link from "next/link";
import ShareModal from "../share-product-modal";
import ShareProductModalContent from "./share-product-modal-content";
import { StatefulButton } from "@/components/Feed/Stateful-btn";
import { toast } from "sonner";
import { useState } from "react";
import { motion , AnimatePresence as _AP } from "framer-motion";

const AnimatePresence = _AP as any;

interface ProductModalContentProps {
    currentProduct: any;
    authenticatedUser: any;
    totalUpvotes: number;
    hasUpvoted: boolean;
    setTotalUpvotes: any;
    setHasUpvoted: any;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({
    currentProduct,
    authenticatedUser,
    totalUpvotes,
    hasUpvoted,
    setTotalUpvotes,
    setHasUpvoted,
}) => {
    const [commentText, setCommentText] = useState("");

    const [shareModalVisible, setShareModalVisible] = useState(false);

    const [comments, setComments] = useState(currentProduct.commentData || []);

    const handleShareClick = () => {
        setShareModalVisible(true);
    };

    const handleCommentSubmit = async () => {
        try {
            // call the comment server action with the product id and the comment text
            await commentOnProduct(currentProduct.id, commentText);

            //reset the comment text
            setCommentText("");
            setComments([
                ...comments,
                {
                    user: authenticatedUser.user.name,
                    body: commentText,
                    profile: authenticatedUser.user.image,
                    userId: authenticatedUser.user.id,
                    timestamp: new Date().toISOString(),
                }
            ])

        } catch (error) {
            console.log(error);
        }

    };

    const handleCommentChange = (event: any) => {
        setCommentText(event.target.value);
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            // Call the deleteComment function with the comment ID
            await deleteProductComment(commentId);
            // Filter out the deleted comment from the comments state
            setComments(comments.filter((comment: any) => comment.id !== commentId));
            toast.success("Comment deleted successfully");
        } catch (error) {
            console.error("Error deleting comment:", error);
            // Handle error appropriately, e.g., display an error message to the user
        }
    };

    const handleUpvoteClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();

        console.log('Upvote Comment handler')
    }







    return (
            <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            <Image
              src={currentProduct.logo}
              alt="logo"
              width={80}
              height={80}
              className="rounded-2xl border border-white/10 shadow-lg bg-white/5"
            />

            <div>
              <h1 className="text-3xl font-bold tracking-tight">{currentProduct.name}</h1>
              <p className="text-zinc-400">{currentProduct.headline}</p>
            </div>
          </div>
        </motion.div>

        {/* ACTION BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 items-center"
        >
          <button
            onClick={() => window.open(currentProduct.website, "_blank")}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-all hover:scale-105"
          >
            Visit Website
          </button>

          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              hasUpvoted
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white border-transparent"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            <ArrowBigUp className={`${hasUpvoted ? "fill-white" : ""}`} />
            {totalUpvotes}
          </button>

          <button
            onClick={() => setShareModalVisible(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300"
          >
            <Upload size={16} /> Share
          </button>
        </motion.div>

        {/* DESCRIPTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 leading-relaxed"
        >
          {currentProduct.description}
        </motion.div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {currentProduct.categories.map((category: any) => (
            <span
              key={category}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300"
            >
              {category}
            </span>
          ))}
        </div>

        {/* CAROUSEL */}
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <CarouselComponent productImages={currentProduct.images} />
        </div>

        {/* COMMENTS */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Community Feedback</h2>

          {/* INPUT */}
          <div className="flex gap-4">
            <Image
              src={authenticatedUser.user.image}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <StatefulButton
              onClickAsync={async () => {
                await commentOnProduct(currentProduct.id, commentText);
                setComments([
                  ...comments,
                  {
                    user: authenticatedUser.user.name,
                    body: commentText,
                    profile: authenticatedUser.user.image,
                    userId: authenticatedUser.user.id,
                    timestamp: new Date().toISOString(),
                  },
                ]);
                setCommentText("");
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
            >
              Comment
            </StatefulButton>
          </div>

          {/* LIST */}
          <div className="space-y-6">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <Image
                  src={comment.profile}
                  alt="profile"
                  width={36}
                  height={36}
                  className="rounded-full"
                />

                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{comment.user}</span>
                      <span className="text-xs text-zinc-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {(comment.userId === authenticatedUser?.user?.id ||
                      currentProduct.userId === authenticatedUser?.user?.id) && (
                      <Trash
                        size={16}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteComment(comment.id)}
                      />
                    )}
                  </div>

                  <p className="text-sm text-zinc-300 mt-2">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ShareModal visible={shareModalVisible} setVisible={setShareModalVisible}>
          <ShareProductModalContent currentProduct={currentProduct} />
        </ShareModal>
      </div>
    </div>
    );
};

export default ProductModalContent;
