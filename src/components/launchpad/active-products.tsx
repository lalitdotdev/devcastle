import { Rocket, Sparkles, TrendingUp } from "lucide-react";
import ProductItem from "./product-item";
import { getAuthSession } from "@/lib/auth";

interface ActiveProductsProps {
    activeProducts: any;
}

// ── Data formatter ────────────────────────────────────────────────────────────
function formatProduct(product: any) {
    const {
        id, name, slug, headline, description, logo,
        releaseDate, website, twitter, discord,
        createdAt, updatedAt, userId, status,
        images = [], categories = [], comments = [], upvotes = [],
    } = product;

    return {
        id, name, slug, headline, description, logo,
        releaseDate, website, twitter, discord,
        createdAt, updatedAt, userId, status,
        images:        images.map((img: any) => img.url),
        categories:    categories.map((cat: any) => cat.name),
        commentsLength: comments.length,
        commentData:   comments.map((c: any) => ({
            id:        c.id,
            profile:   c.profilePicture,
            body:      c.body,
            user:      c.user.name,
            timestamp: c.createdAt,
            userId:    c.user.id,
            name:      c.user.name.toLowerCase().replace(/\s/g, "_"),
        })),
        upvoters: upvotes.map((u: any) => u.user.id),
        upvotes:  upvotes.length,
    };
}

// ── Component ─────────────────────────────────────────────────────────────────
const ActiveProducts = async ({ activeProducts }: ActiveProductsProps) => {
    const authenticatedUser = await getAuthSession();

    const formattedProducts = activeProducts?.map(formatProduct) ?? [];

    return (
        <div className="w-full space-y-8">

            {/* ── Hero banner ── */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-6">
                {/* Ambient glow */}
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-2xl pointer-events-none" />

                <div className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shrink-0 shadow-lg shadow-violet-900/40">
                        <Rocket className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-sm font-semibold text-zinc-100">
                                Welcome to the LaunchPad
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-[10px] font-medium text-violet-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                                Live
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
                            Discover products people are building in the tech ecosystem.
                            Upvote, comment, and support indie makers.
                        </p>
                    </div>
                </div>

                {/* Stats row */}
                <div className="relative flex items-center gap-4 mt-5 pt-4 border-t border-zinc-800/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>{formattedProducts.length} product{formattedProducts.length !== 1 ? "s" : ""} launched</span>
                    </div>
                    <span className="h-3 w-px bg-zinc-800" />
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                        <Sparkles className="h-3 w-3" />
                        <span>Updated daily</span>
                    </div>
                </div>
            </div>

            {/* ── Section header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                        All Products
                    </h2>
                </div>
                <span className="text-[11px] text-zinc-700 tabular-nums">
                    {formattedProducts.length} total
                </span>
            </div>

            {/* ── Product list ── */}
            {formattedProducts.length > 0 ? (
                <div className="space-y-2">
                    {formattedProducts.map((product: any) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            authenticatedUser={authenticatedUser}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 py-20 text-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Rocket className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-400">No products yet</p>
                        <p className="text-xs text-zinc-600 mt-1">Be the first to launch something amazing.</p>
                    </div>
                </div>
            )}

            {/* ── End cap ── */}
            {formattedProducts.length > 0 && (
                <div className="flex items-center gap-3 text-[11px] text-zinc-700 pb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                    <span className="px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                        {formattedProducts.length} product{formattedProducts.length !== 1 ? "s" : ""}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
                </div>
            )}
        </div>
    );
};

export default ActiveProducts;