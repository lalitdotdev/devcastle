"use client";

import { Eye, EyeOff, Loader2, LogIn, Sparkles, UserPlus, TerminalSquare } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import {
    UserLoginValidator,
    UserRegisterationValidator,
} from "@/lib/validators/userCredentials";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence as _AP } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type RegisterationFormData = z.infer<typeof UserRegisterationValidator>;
export type LoginFormData = z.infer<typeof UserLoginValidator>;

const AnimatePresence = _AP as any;

// ── Shared input style ────────────────────────────────────────────────────────
const inputClass =
    "w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-violet-500/60 focus:outline-none transition-colors duration-200";

const labelClass = "text-xs font-medium text-zinc-400 uppercase tracking-wider";

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className={labelClass}>{label}</label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

const UserForm = () => {
    const [formType, setFormType] = useState<"login" | "register">("login");
    const [showPassword, setShowPassword] = useState(false);

    // ── Register form ─────────────────────────────────────────────────────────
    const form = useForm<RegisterationFormData>({
        resolver: zodResolver(UserRegisterationValidator),
        defaultValues: { username: "", email: "", password: "" },
    });

    const { mutate: registerUser, isLoading: isRegisterLoading } = useMutation({
        mutationFn: async ({ username, email, password }: RegisterationFormData) => {
            const { data } = await axios.post("/api/register", { username, email, password });
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.status === 409) {
                return toast({ title: "Email already in use.", description: "Try a different email or sign in.", variant: "destructive" });
            }
            toast({ title: "Registration failed.", description: "Something went wrong. Please try again.", variant: "destructive" });
        },
        onSuccess: () => {
            toast({ title: "Account created!", description: "You can now sign in." });
            setFormType("login");
        },
    });

    // ── Login form ────────────────────────────────────────────────────────────
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(UserLoginValidator),
        defaultValues: { email: "", password: "" },
    });

    const { mutate: loginUser, isLoading: isLoginLoading } = useMutation<void, unknown, LoginFormData>({
        mutationFn: async (data) => {
            const callback = await signIn("credentials", {
                ...data,
                redirect: true,
                callbackUrl: "https://devcastle.vercel.app/feed",
            });
            if (callback?.error) {
                toast({ title: "Invalid credentials.", description: "Please check your email and password.", variant: "destructive" });
            }
        },
        onError: () => {
            toast({ title: "Sign in failed.", description: "Something went wrong. Please try again.", variant: "destructive" });
        },
    });

    const isLogin = formType === "login";

    return (
        <div className="w-full space-y-6">
            {/* ── Tab switcher ── */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
                {(["login", "register"] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFormType(type)}
                        className="relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                    >
                        {formType === type && (
                            <motion.div
                                layoutId="auth-tab"
                                className="absolute inset-0 rounded-lg bg-zinc-800 border border-zinc-700/60"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            />
                        )}
                        <span className={`relative flex items-center gap-1.5 ${formType === type ? "text-zinc-100" : "text-zinc-600"}`}>
                            {type === "login"
                                ? <><LogIn className="h-3.5 w-3.5" />Sign In</>
                                : <><UserPlus className="h-3.5 w-3.5" />Register</>
                            }
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Forms ── */}
            <AnimatePresence mode="wait">
                {isLogin ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(loginUser as any)} className="space-y-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field label="Email" error={loginForm.formState.errors.email?.message}>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        autoComplete="email"
                                                        className={inputClass}
                                                    />
                                                </FormControl>
                                            </Field>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field label="Password" error={loginForm.formState.errors.password?.message}>
                                                <FormControl>
                                                    <div className="relative">
                                                        <input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            autoComplete="current-password"
                                                            className={`${inputClass} pr-11`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                            </Field>
                                        </FormItem>
                                    )}
                                />

                                <button
                                    type="submit"
                                    disabled={isLoginLoading}
                                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold
                                        bg-gradient-to-r from-violet-600 to-fuchsia-600
                                        hover:from-violet-500 hover:to-fuchsia-500
                                        text-white shadow-lg shadow-violet-900/30
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-200 mt-2"
                                >
                                    {isLoginLoading
                                        ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</>
                                        : <><LogIn className="h-4 w-4" />Sign In</>
                                    }
                                </button>
                            </form>
                        </Form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(registerUser as any)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field label="Username" error={form.formState.errors.username?.message}>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="yourhandle"
                                                        autoComplete="username"
                                                        className={inputClass}
                                                    />
                                                </FormControl>
                                            </Field>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field label="Email" error={form.formState.errors.email?.message}>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        autoComplete="email"
                                                        className={inputClass}
                                                    />
                                                </FormControl>
                                            </Field>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field label="Password" error={form.formState.errors.password?.message}>
                                                <FormControl>
                                                    <div className="relative">
                                                        <input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            autoComplete="new-password"
                                                            className={`${inputClass} pr-11`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                            </Field>
                                        </FormItem>
                                    )}
                                />

                                <button
                                    type="submit"
                                    disabled={isRegisterLoading}
                                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold
                                        bg-gradient-to-r from-violet-600 to-fuchsia-600
                                        hover:from-violet-500 hover:to-fuchsia-500
                                        text-white shadow-lg shadow-violet-900/30
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-200 mt-2"
                                >
                                    {isRegisterLoading
                                        ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>
                                        : <><Sparkles className="h-4 w-4" />Create Account</>
                                    }
                                </button>
                            </form>
                        </Form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Legal note ── */}
            <p className="text-center text-[11px] text-zinc-700 leading-relaxed">
                By continuing you agree to our{" "}
                <a href="/terms" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
                    Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
                    Privacy Policy
                </a>
            </p>
        </div>
    );
};

export default UserForm;