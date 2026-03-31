"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Loader2, Users, FileText, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence as _AP } from "framer-motion";
import axios from "axios";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useQuery } from "@tanstack/react-query";

const AnimatePresence = _AP as any;

const SearchBar: FC = () => {
    const [input, setInput] = useState("");
    const pathname    = usePathname();
    const commandRef  = useRef<HTMLDivElement>(null);
    const inputRef    = useRef<HTMLInputElement>(null);
    const router      = useRouter();
    const [focusedIndex, setFocusedIndex] = useState(-1);

    useOnClickOutside(commandRef, () => setInput(""));

    const { isFetching, data: queryResults, refetch, isFetched } = useQuery({
        queryFn: async () => {
            if (!input.trim()) return [];
            const { data } = await axios.get(`/api/search?q=${input}`);
            return Array.isArray(data) ? data : [];
        },
        queryKey: ["search-query"],
        enabled: false,
    });

    const request = useCallback(
        debounce(() => { if (input.trim()) refetch(); }, 300),
        [input, refetch]
    );

    const handleInputChange = (val: string) => {
        setInput(val);
        setFocusedIndex(-1);
        if (val.trim()) request();
    };

    useEffect(() => { setInput(""); }, [pathname]);

    const results = Array.isArray(queryResults) ? queryResults : [];
    const isOpen  = input.trim().length > 0;

    const handleSelect = (name: string) => {
        router.push(`/cb/${name}`);
        router.refresh();
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, results.length - 1)); }
        if (e.key === "ArrowUp")   { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); }
        if (e.key === "Enter" && focusedIndex >= 0) handleSelect(results[focusedIndex].name);
        if (e.key === "Escape") { setInput(""); inputRef.current?.blur(); }
    };

    return (
        <div ref={commandRef} className="relative w-full">
            {/* ── Input ── */}
            <div className="group relative flex items-center gap-2.5 h-9 px-3 rounded-xl border border-zinc-800 bg-zinc-900/60 focus-within:border-violet-500/50 focus-within:bg-zinc-900 transition-all duration-200">
                {isFetching ? (
                    <Loader2 className="h-3.5 w-3.5 text-zinc-600 animate-spin shrink-0" />
                ) : (
                    <Search className="h-3.5 w-3.5 text-zinc-600 group-focus-within:text-violet-400 transition-colors shrink-0" />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search communities…"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-700 focus:outline-none"
                />
                <AnimatePresence>
                    {input && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => { setInput(""); inputRef.current?.focus(); }}
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
                                {isFetching
                                    ? "Searching…"
                                    : isFetched
                                        ? `${results.length} communit${results.length !== 1 ? "ies" : "y"}`
                                        : "Communities"}
                            </span>
                        </div>

                        {/* Results */}
                        {results.length > 0 ? (
                            <ul className="py-1.5 max-h-72 overflow-y-auto">
                                {results.map((community: any, i: number) => (
                                    <li
                                        key={community.id}
                                        onClick={() => handleSelect(community.name)}
                                        className={`group flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                                            focusedIndex === i ? "bg-zinc-800/80" : "hover:bg-zinc-800/60"
                                        }`}
                                    >
                                        {/* Icon badge */}
                                        <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-600">
                                            <Users className="h-3.5 w-3.5" />
                                        </div>

                                        {/* Name + stats */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-zinc-200 truncate">
                                                cb/<span className="text-violet-300">{community.name}</span>
                                            </p>
                                            <div className="flex items-center gap-2.5 mt-0.5">
                                                <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                                                    <Users className="h-2.5 w-2.5" />
                                                    {community._count?.subscribers ?? 0}
                                                </span>
                                                <span className="h-2.5 w-px bg-zinc-800" />
                                                <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                                                    <FileText className="h-2.5 w-2.5" />
                                                    {community._count?.posts ?? 0} posts
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow on hover */}
                                        <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                                    </li>
                                ))}
                            </ul>
                        ) : isFetched && !isFetching ? (
                            <div className="flex flex-col items-center gap-2 py-8 text-center">
                                <Search className="h-5 w-5 text-zinc-700" />
                                <p className="text-xs text-zinc-600">No communities found for &ldquo;{input}&rdquo;</p>
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;