import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  ExternalLink,
  Rss,
  Sparkles,
} from "lucide-react";
import { scrapeArpitBhayaniBlogPosts } from "@/app/feed/actions/getArpitBhayaniBlog";
import Link from "next/link";

// Accent cycling — consistent with FeedItem, CategoryPage, etc.
const ACCENTS = [
  {
    dot: "bg-cyan-400",
    bar: "from-cyan-500",
    glow: "hover:shadow-cyan-500/10",
    tag: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  {
    dot: "bg-violet-400",
    bar: "from-violet-500",
    glow: "hover:shadow-violet-500/10",
    tag: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    dot: "bg-teal-400",
    bar: "from-teal-500",
    glow: "hover:shadow-teal-500/10",
    tag: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  },
  {
    dot: "bg-fuchsia-400",
    bar: "from-fuchsia-500",
    glow: "hover:shadow-fuchsia-500/10",
    tag: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  },
  {
    dot: "bg-amber-400",
    bar: "from-amber-500",
    glow: "hover:shadow-amber-500/10",
    tag: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    dot: "bg-emerald-400",
    bar: "from-emerald-500",
    glow: "hover:shadow-emerald-500/10",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
];

export default async function BlogPosts() {
  const blogPosts = await scrapeArpitBhayaniBlogPosts();

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
      {/* Ambient blobs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-600/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* ── Hero header ── */}
        <div className="mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-6">
            <Rss className="h-3 w-3" />
            {blogPosts.length} article{blogPosts.length !== 1 ? "s" : ""}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.93] mb-5">
            <span className="text-zinc-100">Arpit Bhayani&apos;s</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Engineering Insights
            </span>
          </h1>

          <p className="text-zinc-500 leading-relaxed max-w-2xl text-base">
            Deep dives into{" "}
            <span className="text-zinc-300">System Architecture</span>,{" "}
            <span className="text-zinc-300">Database Internals</span>,{" "}
            <span className="text-zinc-300">Language Internals</span>, and{" "}
            <span className="text-zinc-300">Advanced Algorithms</span> — from a
            passionate software engineer and engineering leader.
          </p>

          {/* Author source link */}
          <a
            href="https://arpitbhayani.me/blogs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            arpitbhayani.me
          </a>
        </div>

        {/* ── Post grid ── */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const href = `https://arpitbhayani.me${post.url}`;

            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm
                                    hover:border-zinc-700/70 hover:bg-zinc-900/70
                                    hover:shadow-xl ${accent.glow}
                                    transition-all duration-300 overflow-hidden`}
              >
                {/* Left accent stripe */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${accent.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  {/* Arrow — revealed on hover */}
                  <div
                    className={`flex items-center justify-center h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 group-hover:text-zinc-200 group-hover:border-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-200`}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="flex-1 text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-3 mb-4">
                  {post.title}
                </h2>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/60">
                  <span
                    className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${accent.tag}`}
                  >
                    Engineering
                  </span>
                  <span className="text-[11px] text-zinc-600 group-hover:text-zinc-400 transition-colors flex items-center gap-1">
                    Read article
                    <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* ── Empty state ── */}
        {blogPosts.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">
                No articles found
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Check back soon or visit the source directly.
              </p>
            </div>
            <a
              href="https://arpitbhayani.me/blogs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold
                                bg-gradient-to-r from-cyan-600 to-teal-600
                                hover:from-cyan-500 hover:to-teal-500
                                text-white shadow-lg shadow-cyan-900/30
                                transition-all duration-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit source
            </a>
          </div>
        )}

        {/* ── Footer CTA + attribution ── */}
        {blogPosts.length > 0 && (
          <div className="mt-14 space-y-6">
            {/* End cap */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-700">
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                <Sparkles className="h-3 w-3" />
                {blogPosts.length} articles
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <a
                href="https://arpitbhayani.me/blogs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold
                                    bg-gradient-to-r from-cyan-600 to-teal-600
                                    hover:from-cyan-500 hover:to-teal-500
                                    text-white shadow-lg shadow-cyan-900/30
                                    transition-all duration-200"
              >
                <BookOpen className="h-4 w-4" />
                Explore all articles
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              {/* Attribution */}
              <div className="space-y-0.5">
                <p className="text-[11px] text-zinc-700">
                  All posts written by{" "}
                  <a
                    href="https://arpitbhayani.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors"
                  >
                    Arpit Bhayani
                  </a>
                  . Scraped with respect.
                </p>
                <p className="text-[11px] text-zinc-700">
                  © {new Date().getFullYear()} Arpit Bhayani. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
