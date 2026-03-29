"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Rss, Plus, Loader2, X } from 'lucide-react';
import { getUrlFeedParser } from "@/app/feed/actions/getUrlFeedParser";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence as _AnimatePresence } from "framer-motion";

const AnimatePresence = _AnimatePresence as any;

const formSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
});

type FormData = z.infer<typeof formSchema>;

async function addFeed(data: FormData) {
    try {
        const response = await getUrlFeedParser(data.url);
        localStorage.setItem('urlCustomFeedItems', JSON.stringify(response));
        localStorage.setItem('urlCustomFeedName', data.name);
        return { success: true, data: response };
    } catch (error) {
        console.error("Failed to fetch or parse feed:", error);
        return { success: false, error: "Failed to fetch or parse feed" };
    }
}

export default function AddFeedDialog({
    onFeedAdded,
}: {
    onFeedAdded: (feedData: any, feedName: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({ resolver: zodResolver(formSchema) });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const result = await addFeed(data);
            if (result?.success) {
                toast.success("Feed imported successfully");
                reset();
                onFeedAdded(result.data, data.name);
                setOpen(false);
                window.location.reload();
            } else {
                toast.error("Failed to import feed", { description: result?.error });
            }
        } catch (error) {
            toast.error("Failed to import feed", {
                description: error instanceof Error ? error.message : "An unknown error occurred",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors duration-200">
                    <Plus className="h-4 w-4" />
                    Add RSS Feed
                </button>
            </DialogTrigger>

            <DialogContent
                className="
                    p-0 gap-0 overflow-hidden
                    bg-[#111113] border border-zinc-800
                    rounded-2xl shadow-2xl shadow-black/60
                    sm:max-w-md
                "
                onInteractOutside={handleClose}
            >
                {/* ── Header ── */}
                <DialogHeader className="px-6 pt-6 pb-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-lime-500 to-green-600 text-white shrink-0">
                                <Rss className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-semibold text-zinc-100 leading-tight">
                                    Add RSS Feed
                                </DialogTitle>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Publication or Blog <span className="text-zinc-600">(Beta)</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="text-zinc-600 hover:text-zinc-300 transition-colors -mt-1 -mr-1 p-1 rounded-lg hover:bg-zinc-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="mx-6 mt-5 border-t border-zinc-800" />

                {/* ── Form ── */}
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-5 pb-6 space-y-5">
                    {/* Feed Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Feed Name
                        </Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="e.g. Hacker News"
                            autoComplete="off"
                            className="
                                h-11 px-4 rounded-xl
                                bg-zinc-900 border border-zinc-800
                                text-zinc-100 placeholder:text-zinc-600 text-sm
                                focus:border-violet-500/60 focus:ring-0 focus:outline-none
                                transition-colors duration-200
                            "
                        />
                        <AnimatePresence>
                            {errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-xs text-red-400"
                                >
                                    {errors.name.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RSS URL */}
                    <div className="space-y-1.5">
                        <Label htmlFor="url" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            RSS Feed URL
                        </Label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                                <Rss className="h-4 w-4" />
                            </div>
                            <Input
                                id="url"
                                {...register("url")}
                                placeholder="https://example.com/feed.xml"
                                autoComplete="off"
                                className="
                                    h-11 pl-10 pr-4 rounded-xl
                                    bg-zinc-900 border border-zinc-800
                                    text-zinc-100 placeholder:text-zinc-600 text-sm
                                    focus:border-violet-500/60 focus:ring-0 focus:outline-none
                                    transition-colors duration-200
                                "
                            />
                        </div>
                        <AnimatePresence>
                            {errors.url && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-xs text-red-400"
                                >
                                    {errors.url.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Hint */}
                    <p className="text-xs text-zinc-600 leading-relaxed">
                        Works with Substack, Medium, Ghost, WordPress, and most blog platforms.
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                flex-1 h-10 rounded-xl text-sm font-medium
                                text-zinc-500 hover:text-zinc-300
                                border border-zinc-800 hover:border-zinc-700
                                bg-transparent hover:bg-zinc-900
                                transition-all duration-200
                            "
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                flex-1 h-10 rounded-xl text-sm font-semibold
                                bg-gradient-to-r from-violet-600 to-fuchsia-600
                                hover:from-violet-500 hover:to-fuchsia-500
                                text-white shadow-lg shadow-violet-900/30
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200
                                flex items-center justify-center gap-2
                            "
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Importing…
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Add Feed
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}