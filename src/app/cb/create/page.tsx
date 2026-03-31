"use client"
import { Castle, ChevronLeft, Loader2, Sparkles, Users, Wand2 } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { CreateCommunityPayload } from '@/lib/validators/community';
import axios from 'axios';
import { toast } from 'sonner';
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const MAX_NAME = 21;
const MAX_DESC = 60;

const Page = () => {
    const [communityName,        setCommunityName]        = useState('');
    const [communityDescription, setCommunityDescription] = useState('');
    const router = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateCommunityPayload = {
                name: communityName,
                description: communityDescription,
            };
            const { data } = await axios.post("/api/community", payload);
            return data;
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409)
                    return toast.error("Community already exists.", { description: "Please choose a different name." });
                if (err.response?.status === 401)
                    return loginToast();
            }
            toast.error("An error occurred.", { description: "Could not create community." });
        },
        onSuccess: (data) => router.push(`/cb/${data.name}`),
    });

    const nameRemaining = MAX_NAME - communityName.length;
    const descRemaining = MAX_DESC - communityDescription.length;
    const canSubmit     = communityName.length > 0 && !isLoading;

    return (
        <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center px-4 ">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-600/5 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-lg"
            >
                {/* Card */}
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">

                    {/* Top accent line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                    <div className="p-7 sm:p-8">

                        {/* ── Header ── */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/40 shrink-0">
                                    <Castle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-base font-semibold text-zinc-100 leading-tight">
                                        Create a Castle
                                    </h1>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        Build your own community
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.back()}
                                className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200"
                                aria-label="Go back"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </div>

                        {/* ── Form ── */}
                        <div className="space-y-6">

                            {/* Castle Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                    Castle Name
                                </label>
                                <div className="relative">
                                    {/* Prefix */}
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-600 pointer-events-none select-none">
                                        cb/
                                    </span>
                                    <input
                                        id="name"
                                        value={communityName}
                                        onChange={(e) => setCommunityName(e.target.value)}
                                        maxLength={MAX_NAME}
                                        placeholder="your-awesome-castle"
                                        autoComplete="off"
                                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-violet-500/60 focus:outline-none transition-colors duration-200"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-zinc-600">Letters, numbers and hyphens only</span>
                                    <span className={`text-[11px] font-medium tabular-nums ${nameRemaining <= 5 ? 'text-amber-400' : 'text-zinc-600'}`}>
                                        {nameRemaining} left
                                    </span>
                                </div>
                            </div>

                            {/* Castle Description */}
                            <div className="space-y-1.5">
                                <label htmlFor="description" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                    Description <span className="text-zinc-700 normal-case tracking-normal font-normal">(optional)</span>
                                </label>
                                <input
                                    id="description"
                                    value={communityDescription}
                                    onChange={(e) => setCommunityDescription(e.target.value)}
                                    maxLength={MAX_DESC}
                                    placeholder="A place for…"
                                    autoComplete="off"
                                    className="w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-violet-500/60 focus:outline-none transition-colors duration-200"
                                />
                                <div className="flex justify-end">
                                    <span className={`text-[11px] font-medium tabular-nums ${descRemaining <= 10 ? 'text-amber-400' : 'text-zinc-600'}`}>
                                        {descRemaining} left
                                    </span>
                                </div>
                            </div>

                            {/* Preview pill */}
                            <AnimatePresence>
                                {communityName.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-violet-500/20 bg-violet-500/5"
                                    >
                                        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shrink-0">
                                            <Users className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-zinc-200 truncate">
                                                cb/<span className="text-violet-300">{communityName}</span>
                                            </p>
                                            {communityDescription && (
                                                <p className="text-[11px] text-zinc-600 truncate mt-0.5">{communityDescription}</p>
                                            )}
                                        </div>
                                        <div className="ml-auto flex items-center gap-1 shrink-0">
                                            <Sparkles className="h-3 w-3 text-violet-400" />
                                            <span className="text-[10px] text-violet-400 font-medium">Preview</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Submit ── */}
                        <div className="mt-8">
                            <button
                                onClick={() => createCommunity()}
                                disabled={!canSubmit}
                                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold
                                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                                    hover:from-violet-500 hover:to-fuchsia-500
                                    text-white shadow-lg shadow-violet-900/30
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    transition-all duration-200"
                            >
                                {isLoading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" />Creating…</>
                                ) : (
                                    <><Wand2 className="h-4 w-4" />Conjure Community</>
                                )}
                            </button>

                            <p className="mt-4 text-center text-[11px] text-zinc-700 leading-relaxed">
                                By creating a castle you agree to our{' '}
                                <a href="/terms" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
                                    community guidelines
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;