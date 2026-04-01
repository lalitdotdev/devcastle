"use client";

import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Loader2,
  MessageCircle,
  Share2,
  Trash2,
  Triangle,
  Tag,
} from "lucide-react";
import {
  commentOnProduct,
  deleteProductComment,
} from "@/lib/launchpad-server-actions/server-actions";
import { motion, AnimatePresence as _AP } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CarouselComponent from "@/components/launchpad/product-image-carousel";
import ShareModal from "../share-product-modal";
import ShareProductModalContent from "./share-product-modal-content";
import { toast } from "sonner";
import { useState } from "react";

const AnimatePresence = _AP as any;

interface ProductModalContentProps {
  currentProduct: any;
  authenticatedUser: any;
  totalUpvotes: number;
  hasUpvoted: boolean;
  setTotalUpvotes: any;
  setHasUpvoted: any;
}

// Accent cycling — consistent with the rest of the system
const ACCENTS = [
  "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "bg-rose-500/10 text-rose-300 border-rose-500/20",
];

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const s = diff / 1000;
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
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
  const [comments, setComments] = useState(currentProduct.commentData || []);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await commentOnProduct(currentProduct.id, commentText);
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          user: authenticatedUser.user.name,
          body: commentText,
          profile: authenticatedUser.user.image,
          userId: authenticatedUser.user.id,
          timestamp: new Date().toISOString(),
        },
      ]);
      setCommentText("");
      toast.success("Comment posted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      await deleteProductComment(commentId);
      setComments(comments.filter((c: any) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (comment: any) =>
    comment.userId === authenticatedUser?.user?.id ||
    currentProduct.userId === authenticatedUser?.user?.id;

  return (
    <div className="text-zinc-100">
      {/* ════════════════════════════════════
                HEADER
            ════════════════════════════════════ */}
      <div className="px-6 pt-6 pb-5 border-b border-zinc-800/60">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="shrink-0 h-16 w-16 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
            <Image
              src={currentProduct.logo}
              alt={currentProduct.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + headline */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="text-lg font-bold text-zinc-100 leading-tight truncate">
              {currentProduct.name}
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
              {currentProduct.headline}
            </p>

            {/* Release date */}
            {currentProduct.releaseDate && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-600">
                <Calendar className="h-3 w-3" />
                {new Date(currentProduct.releaseDate) > new Date()
                  ? `Launches ${new Date(currentProduct.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : "Available now"}
              </div>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-2.5 mt-5">
          {/* Visit website */}
          <button
            onClick={() => window.open(currentProduct.website, "_blank")}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold
                            bg-gradient-to-r from-violet-600 to-fuchsia-600
                            hover:from-violet-500 hover:to-fuchsia-500
                            text-white shadow-lg shadow-violet-900/30
                            transition-all duration-200"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Visit Website
          </button>

          {/* Upvote */}
          <button
            className={`inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold border transition-all duration-200
                            ${
                              hasUpvoted
                                ? "bg-gradient-to-r from-rose-500 to-orange-500 border-rose-500/60 text-white shadow-lg shadow-rose-900/30"
                                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }`}
          >
            <Triangle
              className={`h-3.5 w-3.5 transition-colors ${hasUpvoted ? "fill-white text-white" : ""}`}
            />
            {totalUpvotes}
          </button>

          {/* Share */}
          <button
            onClick={() => setShareModalVisible(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium
                            border border-zinc-800 bg-zinc-900/60 text-zinc-500
                            hover:border-zinc-700 hover:text-zinc-300
                            transition-all duration-200"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>

          {/* Comments count */}
          <div className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[11px] text-zinc-600 border border-zinc-800/60">
            <MessageCircle className="h-3.5 w-3.5" />
            {comments.length}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
                BODY
            ════════════════════════════════════ */}
      <div className="px-6 py-6 space-y-7">
        {/* Description */}
        {currentProduct.description && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                About
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>
        )}

        {/* Category tags */}
        {currentProduct.categories?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Categories
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentProduct.categories.map((cat: string, i: number) => (
                <Link
                  key={cat}
                  href={`/launchpad/category/${cat.toLowerCase()}`}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors duration-150 ${ACCENTS[i % ACCENTS.length]}`}
                >
                  <Tag className="h-2.5 w-2.5" />
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Image carousel */}
        {currentProduct.images?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                Screenshots
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-800/60 bg-zinc-900/40">
              <CarouselComponent productImages={currentProduct.images} />
            </div>
          </div>
        )}

        {/* ── Comments ── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
              Community Feedback
            </span>
            <span className="text-[10px] text-zinc-700 ml-1">
              · {comments.length}
            </span>
          </div>

          {/* Comment input */}
          <div className="flex gap-3 mb-6">
            <div className="shrink-0 h-8 w-8 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <Image
                src={authenticatedUser?.user?.image || ""}
                alt="You"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this product…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-700
                                    focus:border-violet-500/60 focus:outline-none
                                    resize-none transition-colors duration-200 leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  disabled={isSubmitting || !commentText.trim()}
                  className="inline-flex items-center gap-2 h-8 px-4 rounded-lg text-xs font-semibold
                                        bg-gradient-to-r from-violet-600 to-fuchsia-600
                                        hover:from-violet-500 hover:to-fuchsia-500
                                        text-white shadow-sm shadow-violet-900/30
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Posting…
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-3.5 w-3.5" />
                      Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Comment list */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {comments.map((comment: any, i: number) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="flex gap-3 group/comment"
                  >
                    {/* Avatar */}
                    <div className="shrink-0 h-8 w-8 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 mt-0.5">
                      <Image
                        src={comment.profile || ""}
                        alt={comment.user}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Bubble */}
                    <div className="flex-1 min-w-0 px-4 py-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700/80 transition-colors duration-200">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-semibold text-zinc-200 truncate">
                            {comment.user}
                          </span>
                          <span className="h-3 w-px bg-zinc-800 shrink-0" />
                          <span className="text-[10px] text-zinc-600 shrink-0">
                            {timeAgo(comment.timestamp)}
                          </span>
                        </div>

                        {/* Delete */}
                        {canDelete(comment) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deletingId === comment.id}
                            className="shrink-0 opacity-0 group-hover/comment:opacity-100 flex items-center justify-center h-6 w-6 rounded-lg
                                                            border border-zinc-800 bg-zinc-900/60 text-zinc-700
                                                            hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5
                                                            disabled:opacity-30 transition-all duration-200"
                            aria-label="Delete comment"
                          >
                            {deletingId === comment.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {comment.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 text-center rounded-2xl border border-zinc-800/40 bg-zinc-900/20">
              <div className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-zinc-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">
                  No feedback yet
                </p>
                <p className="text-[11px] text-zinc-700 mt-0.5">
                  Be the first to share your thoughts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share modal */}
      <ShareModal visible={shareModalVisible} setVisible={setShareModalVisible}>
        <ShareProductModalContent currentProduct={currentProduct} />
      </ShareModal>
    </div>
  );
};

export default ProductModalContent;
