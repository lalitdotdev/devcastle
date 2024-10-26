import { AlertCircle, ArrowRight, CheckCircle2, LogIn } from "lucide-react";

import Link from "next/link";
import { toast } from "./use-toast";

export const useCustomToast = () => {
    const loginToast = () => {
        const { dismiss } = toast({
            title: (
                <span className="flex items-center gap-3 font-medium text-zinc-100">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-sm tracking-tight">Authentication Required</span>
                </span>
            ) as any,
            description: (
                <span className="mt-2 text-sm font-normal text-zinc-300/80">
                    Please sign in to access this feature and unlock all capabilities.
                </span>
            ) as any,
            variant: "destructive",
            duration: 5000,
            action: (
                <Link
                    href="/sign-in"
                    onClick={() => dismiss()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all  hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-zinc-100/50 active:translate-y-px "
                >
                    <LogIn className="h-4 w-4" />
                    SignIn

                </Link>
            ),
            className: "group border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-zinc-900/50 dark:bg-zinc-900/50",
        });
    };

    const successLoginToast = () => {
        toast({
            title: (
                <span className="flex items-center gap-3 font-medium text-zinc-100">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-sm tracking-tight">Welcome back!</span>
                </span>
            ) as any,
            description: (
                <span className="mt-2 text-sm font-normal text-zinc-300/80">
                    You&apos;ve successfully signed in to your account.
                </span>
            ) as any,
            duration: 3000,
            className: "group border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-zinc-900/50 dark:bg-zinc-900/50",
        });
    };

    return { loginToast, successLoginToast };
};
