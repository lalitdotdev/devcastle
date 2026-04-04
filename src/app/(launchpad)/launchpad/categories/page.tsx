import Link from "next/link";
import { ArrowUpRight, Sparkles, Grid } from "lucide-react";
import { getCategories } from "@/lib/launchpad-server-actions/server-actions";

// Accent colors cycling per category index
const ACCENTS = [
  {
    bar: "from-violet-500 to-fuchsia-500",
    glow: "hover:shadow-violet-500/10",
    ring: "hover:border-violet-500/40",
    dot: "bg-violet-400",
    tag: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    bar: "from-cyan-500 to-blue-500",
    glow: "hover:shadow-cyan-500/10",
    ring: "hover:border-cyan-500/40",
    dot: "bg-cyan-400",
    tag: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    bar: "from-emerald-500 to-teal-500",
    glow: "hover:shadow-emerald-500/10",
    ring: "hover:border-emerald-500/40",
    dot: "bg-emerald-400",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  {
    bar: "from-amber-500 to-orange-500",
    glow: "hover:shadow-amber-500/10",
    ring: "hover:border-amber-500/40",
    dot: "bg-amber-400",
    tag: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    bar: "from-rose-500 to-pink-500",
    glow: "hover:shadow-rose-500/10",
    ring: "hover:border-rose-500/40",
    dot: "bg-rose-400",
    tag: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  {
    bar: "from-fuchsia-500 to-violet-500",
    glow: "hover:shadow-fuchsia-500/10",
    ring: "hover:border-fuchsia-500/40",
    dot: "bg-fuchsia-400",
    tag: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  },
];

const Categories = async () => {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
      {/* Ambient blobs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* ── Hero header ── */}
        <div className="mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            {categories.length} categories
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] mb-4">
            <span className="text-zinc-100">Explore by</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Category
            </span>
          </h1>
          <p className="text-zinc-500 leading-relaxed max-w-lg">
            Browse products organised by what they do. Find tools, apps, and
            services that fit your workflow.
          </p>
        </div>

        {/* ── Category grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((category: any, i: number) => {
            const accent = ACCENTS[i % ACCENTS.length];

            return (
              <Link
                key={category.id}
                href={`/launchpad/category/${category.name.toLowerCase()}`}
                className={`group relative flex items-center gap-4 p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm
                                    hover:border-zinc-700/70 hover:bg-zinc-900/70
                                    hover:shadow-xl ${accent.glow} ${accent.ring}
                                    transition-all duration-300 overflow-hidden`}
              >
                {/* Left gradient accent stripe */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${accent.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Icon badge */}
                <div
                  className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${accent.bar} text-white shadow-lg`}
                >
                  <Grid className="h-4 w-4" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                    {category.name}
                  </h2>
                  {category._count?.products !== undefined && (
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      {category._count.products} product
                      {category._count.products !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Arrow — revealed on hover */}
                <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 group-hover:text-zinc-200 group-hover:border-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Empty state ── */}
        {categories.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Grid className="h-6 w-6 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">
                No categories yet
              </p>
              <p className="text-xs text-zinc-600 mt-1">Check back soon.</p>
            </div>
          </div>
        )}

        {/* ── End cap ── */}
        {categories.length > 0 && (
          <div className="flex items-center gap-3 text-[11px] text-zinc-700 mt-8">
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
              <Sparkles className="h-3 w-3" />
              {categories.length} categories
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
          </div>
        )}
      </div>
    </main>
  );
};

export default Categories;
