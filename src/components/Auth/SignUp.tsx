import { FC } from "react";
import Link from "next/link";
import { TerminalSquare, Github } from "lucide-react";
import UserAuthForm from "./UserAuthForm";
import UserForm from "./Useform";

const SignUp: FC = () => {
    return (
        <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center px-4 py-20">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-600/5 blur-[100px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Card */}
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                    {/* Top accent */}
                    <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                    <div className="p-7 sm:p-8 space-y-7">
                        {/* ── Brand header ── */}
                        <div className="text-center space-y-3">
                            <Link href="/" className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-900/40 mx-auto">
                                <TerminalSquare className="h-6 w-6 text-white" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-zinc-100">
                                    Join DevCastle
                                </h1>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed max-w-xs mx-auto">
                                    A platform built by developers, for developers.
                                    Connect, build, and ship.
                                </p>
                            </div>
                        </div>

                        {/* ── OAuth ── */}
                        <div className="space-y-2">
                            <UserAuthForm />
                        </div>

                        {/* ── Divider ── */}
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-zinc-800" />
                            <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                                or continue with email
                            </span>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        {/* ── Email form ── */}
                        <UserForm />
                    </div>
                </div>

                {/* Already have an account */}
                <p className="text-center text-xs text-zinc-600 mt-5">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;