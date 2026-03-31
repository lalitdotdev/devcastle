"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X, Loader2, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence as _AP} from "framer-motion";
import { searchProducts } from "@/lib/launchpad-server-actions/server-actions";
import { useRouter } from "next/navigation";


const AnimatePresence = _AP as any;

interface Product {
    id: string;
    name: string;
    slug: string;
    headline: string;
    description: string;
    logo: string;
    releaseDate: string;
    website: string;
    twitter: string;
    discord: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: string;
}

const Search = () => {
    const [query,             setQuery]             = useState("");
    const [results,           setResults]           = useState<Product[]>([]);
    const [isOpen,            setIsOpen]            = useState(false);
    const [isLoading,         setIsLoading]         = useState(false);
    const [focusedIndex,      setFocusedIndex]      = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef     = useRef<HTMLInputElement>(null);
    const router       = useRouter();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setFocusedIndex(-1);

        if (!val.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const products: Product[] = await searchProducts(val);
            const active = products.filter((p) => p.status === "ACTIVE");
            setResults(active);
            setIsOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (slug: string, name: string) => {
        setQuery(name);
        setIsOpen(false);
        router.push(`/launchpad/product/${slug}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === "ArrowUp")   { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); }
        if (e.key === "Enter" && focusedIndex >= 0) handleSelect(results[focusedIndex].slug, results[focusedIndex].name);
        if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
    };

    const clearQuery = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {/* ── Input ── */}
            <div className="group relative flex items-center gap-2.5 h-9 px-3 rounded-xl border border-zinc-800 bg-zinc-900/60 focus-within:border-violet-500/50 focus-within:bg-zinc-900 transition-all duration-200">
                {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 text-zinc-600 animate-spin shrink-0" />
                ) : (
                    <SearchIcon className="h-3.5 w-3.5 text-zinc-600 group-focus-within:text-violet-400 transition-colors shrink-0" />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products…"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-700 focus:outline-none"
                />
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearQuery}
                            className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
                        >
                            <X className="h-3.5 w-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Dropdown ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-0 right-0 mt-2 z-[999] rounded-2xl border border-zinc-800 bg-[#111113] shadow-2xl shadow-black/60 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-3 py-2 border-b border-zinc-800/60">
                            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                                {results.length > 0 ? `${results.length} product${results.length !== 1 ? "s" : ""}` : "No results"}
                            </span>
                        </div>

                        {results.length > 0 ? (
                            <ul className="py-1.5 max-h-72 overflow-y-auto">
                                {results.map((product, i) => (
                                    <li
                                        key={product.id}
                                        onClick={() => handleSelect(product.slug, product.name)}
                                        className={`group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                                            focusedIndex === i ? "bg-zinc-800/80" : "hover:bg-zinc-800/60"
                                        }`}
                                    >
                                        {/* Logo */}
                                        <div className="shrink-0 h-8 w-8 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                                            <Image
                                                src={product.logo}
                                                alt={product.name}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-zinc-200 truncate">{product.name}</p>
                                            <p className="text-[10px] text-zinc-600 truncate mt-0.5">{product.headline}</p>
                                        </div>

                                        {/* Arrow on hover */}
                                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-8 text-center">
                                <SearchIcon className="h-5 w-5 text-zinc-700" />
                                <p className="text-xs text-zinc-600">No products found for &ldquo;{query}&rdquo;</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Search;