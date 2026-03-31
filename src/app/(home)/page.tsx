import { Metadata } from "next";
import SignIn from "@/components/Auth/Useform";
import { TweetGridDemo } from "@/components/TweetGrid";
import UserAuthForm from "@/components/Auth/UserAuthForm";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    TerminalSquare, Users, Rocket, Briefcase, BookOpen,
    ArrowRight, Globe2, Star, Zap, Shield, Code2,
    MessageSquare, TrendingUp, Package, Sparkles,
} from "lucide-react";

export function generateMetadata(): Metadata {
    return {
        title: "DevCastle — The Developer Community Platform",
        description:
            "Connect with developers, discover opportunities, ship products, and grow together. DevCastle is where the builder community lives.",
    };
}

// ── Feature card data ─────────────────────────────────────────────────────────
const FEATURES = [
    {
        icon: MessageSquare,
        color: "from-violet-600 to-fuchsia-600",
        glow: "bg-violet-500/10",
        title: "Community Discussions",
        desc: "Create castles around any topic. Share ideas, ask questions, and learn from developers around the world.",
    },
    {
        icon: Rocket,
        color: "from-orange-500 to-rose-600",
        glow: "bg-orange-500/10",
        title: "Creator Launchpad",
        desc: "Ship your products and get real feedback. Upvote, discover, and support indie makers building in public.",
    },
    {
        icon: Briefcase,
        color: "from-emerald-500 to-cyan-600",
        glow: "bg-emerald-500/10",
        title: "Opportunities",
        desc: "Find your next role or hire exceptional talent. Curated jobs from the best companies building with developers.",
    },
    {
        icon: BookOpen,
        color: "from-amber-500 to-orange-600",
        glow: "bg-amber-500/10",
        title: "Feed Reader",
        desc: "Stay updated with curated content from Paul Graham, TechCrunch, GitHub Trending, and your custom RSS feeds.",
    },
    {
        icon: Users,
        color: "from-cyan-500 to-blue-600",
        glow: "bg-cyan-500/10",
        title: "Professional Network",
        desc: "Build meaningful connections with engineers, designers, and founders. Your tribe is here.",
    },
    {
        icon: TrendingUp,
        color: "from-fuchsia-500 to-violet-600",
        glow: "bg-fuchsia-500/10",
        title: "Startup Catalog",
        desc: "Explore Hacker News job timelines, Crunchbase feeds, Product Hunt showcases, and top stories — all in one place.",
    },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
    { value: "10K+", label: "Developers" },
    { value: "500+", label: "Castles" },
    { value: "2K+", label: "Products launched" },
    { value: "1K+", label: "Opportunities" },
];

// ── Trust badges ──────────────────────────────────────────────────────────────
const TRUST = [
    { icon: Shield,  label: "Open source" },
    { icon: Zap,     label: "Always free tier" },
    { icon: Globe2,  label: "Global community" },
    { icon: Code2,   label: "Built for devs" },
];

export default async function Home() {
    const session = await getAuthSession();
    if (session?.user) redirect("/feed");

    return (
        <main className="min-h-screen bg-[#0d0d0f] text-zinc-100 overflow-x-hidden">

            {/* ── Fixed ambient background ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
                <div className="absolute -top-60 -left-40 h-[700px] w-[700px] rounded-full bg-violet-600/8 blur-[140px]" />
                <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-600/6 blur-[120px]" />
                <div className="absolute bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/6 blur-[100px]" />
            </div>

            {/* ════════════════════════════════════════════════════
                HERO
            ════════════════════════════════════════════════════ */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                    Built by developers · For developers
                </div>

                {/* Headline */}
                <h1 className="text-center font-black tracking-tight leading-[0.92] max-w-4xl mx-auto mb-6">
                    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-zinc-100">
                        Where Builders
                    </span>
                    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                        Come Alive
                    </span>
                </h1>

                {/* Sub */}
                <p className="text-center text-zinc-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                    DevCastle is the community platform for developers, designers, and
                    indie makers. Discuss ideas, launch products, find opportunities,
                    and connect with the people building the future.
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {TRUST.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-600">
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </div>
                    ))}
                </div>

                {/* ── Auth card ── */}
                <div className="w-full max-w-sm">
                    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                        <div className="p-7 space-y-5">
                            {/* Brand mark */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/40">
                                    <TerminalSquare className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-100">Get started free</p>
                                    <p className="text-[11px] text-zinc-500">Join 10,000+ developers</p>
                                </div>
                            </div>

                            {/* OAuth */}
                            <UserAuthForm />

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-zinc-800" />
                                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">or email</span>
                                <div className="h-px flex-1 bg-zinc-800" />
                            </div>

                            {/* Email form */}
                            <SignIn />
                        </div>
                    </div>

                    <p className="text-center text-[11px] text-zinc-700 mt-4">
                        No credit card required · Free forever
                    </p>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <p className="text-2xl font-black text-zinc-100">{value}</p>
                            <p className="text-xs text-zinc-600 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Scroll hint */}
                <div className="mt-16 flex flex-col items-center gap-2 text-zinc-700">
                    <span className="text-[11px] uppercase tracking-widest">Explore</span>
                    <div className="h-8 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                FEATURES
            ════════════════════════════════════════════════════ */}
            <section className="relative z-10 px-4 sm:px-6 py-24 max-w-6xl mx-auto">
                {/* Section label */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-500 text-xs font-medium mb-4">
                        <Sparkles className="h-3.5 w-3.5" />
                        Everything you need
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-100 mb-4">
                        One platform.<br />
                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                            Infinite possibilities.
                        </span>
                    </h2>
                    <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed">
                        DevCastle brings together the tools developers actually need —
                        community, jobs, products, and content — in one cohesive experience.
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FEATURES.map(({ icon: Icon, color, glow, title, desc }) => (
                        <div
                            key={title}
                            className="group relative p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300"
                        >
                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-2xl ${glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            <div className={`relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${color} text-white mb-4 shadow-lg`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="relative text-sm font-semibold text-zinc-200 mb-2 group-hover:text-white transition-colors">
                                {title}
                            </h3>
                            <p className="relative text-xs text-zinc-600 leading-relaxed">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                COMMUNITY PROOF — Tweet grid
            ════════════════════════════════════════════════════ */}
        
            {/* ════════════════════════════════════════════════════
                BOTTOM CTA
            ════════════════════════════════════════════════════ */}
            <section className="relative z-10 px-4 sm:px-6 py-24">
                <div className="relative max-w-3xl mx-auto text-center">
                    {/* Card */}
                    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-12 overflow-hidden">
                        {/* Inner glow */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

                        <div className="relative">
                            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white mx-auto mb-6 shadow-lg shadow-violet-900/40">
                                <TerminalSquare className="h-7 w-7" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-100 mb-4">
                                Ready to build your castle?
                            </h2>
                            <p className="text-zinc-500 leading-relaxed mb-8 max-w-md mx-auto">
                                Join thousands of developers who call DevCastle home.
                                It&apos;s free to get started and always will be.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    href="/sign-up"
                                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold
                                        bg-gradient-to-r from-violet-600 to-fuchsia-600
                                        hover:from-violet-500 hover:to-fuchsia-500
                                        text-white shadow-lg shadow-violet-900/30
                                        transition-all duration-200"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Get started free
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/feed"
                                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold
                                        border border-zinc-800 bg-transparent text-zinc-400
                                        hover:border-zinc-700 hover:text-zinc-200
                                        transition-all duration-200"
                                >
                                    Browse feed
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-zinc-800/60 px-4 sm:px-6 py-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
                            <TerminalSquare className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-zinc-500">DevCastle</span>
                    </div>
                    <p className="text-[11px] text-zinc-700">
                        © {new Date().getFullYear()} DevCastle. Built with ♥ for the dev community.
                    </p>
                    <div className="flex items-center gap-4">
                        {["Terms", "Privacy", "GitHub"].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </footer>
        </main>
    );
}