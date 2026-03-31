"use client";

import { ArrowUpRight, MessageCircle, Triangle, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductModal from "../modals/launchpad/product-modal";
import ProductModalContent from "../modals/contents/product-modal-content";
import { motion, useInView } from "framer-motion";
import { upvoteProduct } from "@/lib/launchpad-server-actions/server-actions";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRef, useState } from "react";

interface ProductItemProps {
    product: any;
    authenticatedUser: any;
    index?: number;
}

// Accent cycling — same pattern as FeedItem / JobRow
const ACCENTS = [
    { dot: "bg-violet-400",  bar: "from-violet-500",  glow: "group-hover:shadow-violet-500/10"  },
    { dot: "bg-emerald-400", bar: "from-emerald-500", glow: "group-hover:shadow-emerald-500/10" },
    { dot: "bg-cyan-400",    bar: "from-cyan-500",    glow: "group-hover:shadow-cyan-500/10"    },
    { dot: "bg-fuchsia-400", bar: "from-fuchsia-500", glow: "group-hover:shadow-fuchsia-500/10" },
    { dot: "bg-amber-400",   bar: "from-amber-500",   glow: "group-hover:shadow-amber-500/10"   },
    { dot: "bg-rose-400",    bar: "from-rose-500",    glow: "group-hover:shadow-rose-500/10"    },
];

function accentForId(id: string) {
    const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ACCENTS[sum % ACCENTS.length];
}

const ProductItem: React.FC<ProductItemProps> = ({
    product,
    authenticatedUser,
    index = 0,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

    const [showProductModal, setShowProductModal] = useState(false);
    const [currentProduct, setCurrentProduct]     = useState<any>(null);
    const [hasUpvoted, setHasUpvoted]             = useState(
        product.upvoters?.includes(authenticatedUser?.user?.id)
    );
    const [totalUpvotes, setTotalUpvotes]         = useState(product.upvotes || 0);
    const { loginToast } = useCustomToast();

    const accent = accentForId(product.id);

    const handleProductClick = () => {
        if (!authenticatedUser) return loginToast();
        setCurrentProduct(product);
        setShowProductModal(true);
    };

    const handleArrowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(product.website, "_blank");
    };

    const handleUpvoteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!authenticatedUser) return loginToast();
        try {
            await upvoteProduct(product.id);
            setHasUpvoted((prev: boolean) => !prev);
            setTotalUpvotes((prev: number) => hasUpvoted ? prev - 1 : prev + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const releaseDate  = product.releaseDate && new Date(product.releaseDate);
    const isUpcoming   = releaseDate && releaseDate > new Date();
    const releasedLabel = isUpcoming
        ? releaseDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Available Now";

    return (
        <>
            <motion.div
                ref={ref}
                onClick={handleProductClick}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.35),
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative cursor-pointer"
            >
                {/* Card */}
                <div className={`relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm
                    hover:border-zinc-700/70 hover:bg-zinc-900/70
                    hover:shadow-xl ${accent.glow}
                    transition-all duration-300 overflow-hidden`}
                >
                    {/* Left accent stripe */}
                    <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full
                        bg-gradient-to-b ${accent.bar} to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <div className="flex items-center gap-4 p-4 pl-5">
                        {/* ── Logo ── */}
                        <div className="shrink-0 h-12 w-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                            <Image
                                src={product.logo}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>

                        {/* ── Content ── */}
                        <div className="flex-1 min-w-0 space-y-2">
                            {/* Title + external link */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug truncate">
                                        {product.name}
                                    </h2>
                                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                                        {product.headline}
                                    </p>
                                </div>

                                {/* Visit website — revealed on hover */}
                                <button
                                    onClick={handleArrowClick}
                                    aria-label="Visit website"
                                    className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg
                                        border border-zinc-800 bg-zinc-900/80
                                        text-zinc-600 hover:text-zinc-200 hover:border-zinc-600
                                        transition-all duration-200 opacity-0 group-hover:opacity-100 mt-0.5"
                                >
                                    <ArrowUpRight className="h-3 w-3" />
                                </button>
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                {/* Comments */}
                                <span className="flex items-center gap-1 text-[11px] text-zinc-600">
                                    <MessageCircle className="h-3 w-3" />
                                    {product.commentsLength}
                                </span>

                                {/* Release date */}
                                <span className="h-3 w-px bg-zinc-800" />
                                <span className={`flex items-center gap-1 text-[11px] ${isUpcoming ? "text-amber-500" : "text-zinc-600"}`}>
                                    <Calendar className="h-3 w-3" />
                                    {releasedLabel}
                                </span>

                                {/* Category tags */}
                                {product.categories.slice(0, 3).map((category: string) => (
                                    <Link
                                        key={category}
                                        href={`/launchpad/category/${category.toLowerCase()}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full
                                            border border-zinc-800 bg-zinc-900/60 text-zinc-500
                                            hover:border-zinc-700 hover:text-zinc-300 transition-all duration-150"
                                    >
                                        {category}
                                    </Link>
                                ))}
                                {product.categories.length > 3 && (
                                    <span className="text-[10px] text-zinc-700">
                                        +{product.categories.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ── Upvote button ── */}
                        <button
                            onClick={handleUpvoteClick}
                            aria-label="Upvote"
                            className={`shrink-0 flex flex-col items-center justify-center gap-0.5
                                h-14 w-12 rounded-xl border transition-all duration-200
                                ${hasUpvoted
                                    ? "bg-gradient-to-b from-rose-500 to-orange-500 border-rose-500/60 shadow-lg shadow-rose-900/30"
                                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/60"
                                }`}
                        >
                            <Triangle className={`h-3.5 w-3.5 transition-colors ${hasUpvoted ? "text-white fill-white" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                            <span className={`text-xs font-semibold tabular-nums transition-colors ${hasUpvoted ? "text-white" : "text-zinc-500"}`}>
                                {totalUpvotes}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Modal */}
            <ProductModal visible={showProductModal} setVisible={setShowProductModal}>
                <ProductModalContent
                    currentProduct={currentProduct}
                    authenticatedUser={authenticatedUser}
                    setTotalUpvotes={setTotalUpvotes}
                    totalUpvotes={totalUpvotes}
                    hasUpvoted={hasUpvoted}
                    setHasUpvoted={setHasUpvoted}
                />
            </ProductModal>
        </>
    );
};

export default ProductItem;