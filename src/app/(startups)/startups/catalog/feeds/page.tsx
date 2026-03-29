"use client";

import { BarChart, Lightbulb, LucideIcon, Rss, Search, X, BookOpen, Code2, Newspaper, ExternalLink } from "lucide-react";
import { Github, fetchGithubTrending } from "@/app/feed/actions/fetchGithubTrending";
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import AddFeedDialog from "@/components/Feed/UrlFeedFormDialog";
import TrendingRepoList from "@/components/TredingRepoList";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getEntrepreneurFeed } from "@/app/feed/actions/getEntrepreneurFeed";
import { getEssays } from "../../actions";
import { getSimonWillisonFeed } from "@/app/feed/actions/getSimonWillisonFeed";
import { getStartupMagazineFeed } from "@/app/feed/actions/getStartupMagazineFeed";
import { getTechCrunchFeed } from "@/app/feed/actions/getTechcrunchFeed";
import { motion, AnimatePresence as _AP } from "framer-motion";
import FeedList from "@/components/Feed/Feedlist";

const AnimatePresence = _AP as any;

interface TabItem {
  value: string;
  icon?: string | LucideIcon;
  label: string;
}

export interface FeedItem {
  id: string;
  title: string;
  link?: string;
  pubDate: Date;
  contentSnippet: string;
  categories: { id: string; name: string }[];
  content: string;
  author?: string;
  imageUrl?: string;
}

function FeedSkeleton() {
  return (
    <div className="relative pl-8 space-y-3">
      <div className="absolute left-[5px] top-0 bottom-0 w-px bg-zinc-800/60 rounded-full" />
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="flex gap-4 p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 animate-pulse" style={{ animationDelay: `${i * 70}ms` }}>
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-zinc-800 rounded-full w-3/4" />
            <div className="h-2.5 bg-zinc-800/70 rounded-full w-1/3" />
            <div className="h-2.5 bg-zinc-800/50 rounded-full w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 group-focus-within:border-violet-500/50 transition-all duration-300 backdrop-blur-sm">
        <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors shrink-0" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search articles, repos, essays…" className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none" />
        <AnimatePresence>
          {value && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => onChange("")} className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const sourceMeta: Record<string, { label: string; color: string; href: string; icon: React.ReactNode; desc: string }> = {
  techCrunch:      { label: "TechCrunch",          color: "from-green-500 to-emerald-600",  href: "https://techcrunch.com",         icon: <Newspaper className="h-4 w-4" />, desc: "Breaking tech news and startup coverage." },
  entrepreneur:    { label: "Entrepreneur",         color: "from-amber-500 to-orange-600",   href: "https://entrepreneur.com",       icon: <Lightbulb className="h-4 w-4" />, desc: "Articles for founders and business builders." },
  startupMagazine: { label: "The Startup Magazine", color: "from-rose-500 to-pink-600",      href: "https://thestartupmagazine.com", icon: <BarChart className="h-4 w-4" />,  desc: "Resources for the startup ecosystem." },
  paulGraham:      { label: "Paul Graham Essays",   color: "from-blue-500 to-indigo-600",    href: "https://paulgraham.com",         icon: <BookOpen className="h-4 w-4" />,  desc: "Timeless essays on startups and life." },
  simonWillison:   { label: "Simon Willison",       color: "from-teal-500 to-cyan-600",      href: "https://simonwillison.net",      icon: <Rss className="h-4 w-4" />,       desc: "Deep dives on AI, open source and the web." },
  githubTrending:  { label: "GitHub Trending",      color: "from-zinc-400 to-zinc-600",      href: "https://github.com/trending",    icon: <Code2 className="h-4 w-4" />,     desc: "The most-starred repos this week." },
};

function SourceHeader({ tabValue, customName }: { tabValue: string; customName?: string }) {
  const meta = sourceMeta[tabValue];
  if (!meta && !customName) return null;
  const label = meta?.label ?? customName ?? "Custom Feed";
  const color = meta?.color ?? "from-lime-500 to-green-600";
  const href  = meta?.href  ?? "#";
  const icon  = meta?.icon  ?? <Rss className="h-4 w-4" />;
  const desc  = meta?.desc  ?? "Your custom RSS feed.";
  return (
    <Link href={href} target="_blank" rel="noreferrer" className="group block mb-8">
      <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300">
        <div className={`flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br ${color} text-white shrink-0`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{label}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
        </div>
        <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
      </div>
    </Link>
  );
}

function filterItems<T extends { title?: string; contentSnippet?: string; name?: string; description?: string }>(items: T[], query: string): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter((item) =>
    (item.title ?? item.name ?? "").toLowerCase().includes(q) ||
    (item.contentSnippet ?? item.description ?? "").toLowerCase().includes(q)
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 py-20 text-center">
      <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center"><Search className="h-6 w-6 text-zinc-600" /></div>
      <p className="text-zinc-400 font-medium">No results for &ldquo;{query}&rdquo;</p>
      <p className="text-zinc-600 text-sm">Try a different search term.</p>
    </motion.div>
  );
}

export default function FeedPage() {
  const [urlCustomfeeds, setUrlCustomfeeds] = useState<FeedItem[]>(() => {
    if (typeof window === "undefined") return [];
    const s = localStorage.getItem("urlCustomFeedItems");
    return s ? JSON.parse(s) : [];
  });
  const [customFeedName, setCustomFeedName] = useState<string>(() => {
    if (typeof window === "undefined") return "Custom Feed";
    return localStorage.getItem("urlCustomFeedName") || "Custom Feed";
  });

  const [paulGrahamEssays,    setPaulGrahamEssays]    = useState<any[]>([]);
  const [simonWillisonEssays, setSimonWillisonEssays] = useState<any[]>([]);
  const [entrepreneurEssays,  setEntrepreneurEssays]  = useState<any[]>([]);
  const [githubTrendingRepos, setGithubTrendingRepos] = useState<Github[]>([]);
  const [startupMagazineFeed, setStartupMagazineFeed] = useState<any[]>([]);
  const [techCrunchFeed,      setTechCrunchFeed]      = useState<any[]>([]);
  const [isLoading,           setIsLoading]           = useState(true);
  const [searchQuery,         setSearchQuery]         = useState("");
  const [activeTab,           setActiveTab]           = useState("techCrunch");

  const tabItems: TabItem[] = [
    { value: "techCrunch",      icon: "/logo/tc.svg",     label: "TechCrunch" },
    { value: "entrepreneur",    icon: Lightbulb,          label: "Entrepreneur" },
    { value: "startupMagazine", icon: BarChart,           label: "The Startup Magazine" },
    { value: "paulGraham",      icon: Rss,                label: "Paul Graham" },
    { value: "simonWillison",   label: "Simon Willison" },
    { value: "githubTrending",  icon: "/logo/github.svg", label: "GitHub Trending" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [essays, simon, entrepreneur, github, startup, techcrunch] = await Promise.all([
        getEssays(), getSimonWillisonFeed(), getEntrepreneurFeed(),
        fetchGithubTrending(), getStartupMagazineFeed(), getTechCrunchFeed(),
      ]);
      setPaulGrahamEssays(essays as any);
      setSimonWillisonEssays(simon);
      setEntrepreneurEssays(entrepreneur as any);
      setGithubTrendingRepos(github);
      setStartupMagazineFeed(startup);
      setTechCrunchFeed(techcrunch);
      const sf = localStorage.getItem("urlCustomFeedItems");
      if (sf) setUrlCustomfeeds(JSON.parse(sf));
      const sn = localStorage.getItem("urlCustomFeedName");
      if (sn) setCustomFeedName(sn);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleTabChange = (v: string) => { setActiveTab(v); setSearchQuery(""); };

  const filteredPG     = useMemo(() => filterItems(paulGrahamEssays,    searchQuery), [paulGrahamEssays,    searchQuery]);
  const filteredSimon  = useMemo(() => filterItems(simonWillisonEssays, searchQuery), [simonWillisonEssays, searchQuery]);
  const filteredEnt    = useMemo(() => filterItems(entrepreneurEssays,  searchQuery), [entrepreneurEssays,  searchQuery]);
  const filteredTC     = useMemo(() => filterItems(techCrunchFeed,      searchQuery), [techCrunchFeed,      searchQuery]);
  const filteredSM     = useMemo(() => filterItems(startupMagazineFeed, searchQuery), [startupMagazineFeed, searchQuery]);
  const filteredGH     = useMemo(() => filterItems(githubTrendingRepos, searchQuery), [githubTrendingRepos, searchQuery]);
  const filteredCustom = useMemo(() => filterItems(urlCustomfeeds,      searchQuery), [urlCustomfeeds,      searchQuery]);

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const [isTabListFixed, setIsTabListFixed] = useState(false);
  const [tabListHeight, setTabListHeight]   = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tabListRef.current) setIsTabListFixed(window.scrollY > tabListRef.current.offsetTop);
    };
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setTabListHeight(e.contentRect.height);
    });
    if (tabListRef.current) ro.observe(tabListRef.current);
    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("scroll", handleScroll); ro.disconnect(); };
  }, []);

  const TabSection = ({ value, items, emptyMsg }: { value: string; items: any[]; emptyMsg: string }) => (
    <TabsContent value={value} className="mt-0 outline-none focus-visible:ring-0">
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
        <SourceHeader tabValue={value} />
        {isLoading ? (
          <FeedSkeleton />
        ) : items.length === 0 && searchQuery ? (
          <EmptyState query={searchQuery} />
        ) : items.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <FeedList items={items} />
          </motion.div>
        ) : (
          <p className="text-zinc-500 py-10 text-center text-sm">{emptyMsg}</p>
        )}
      </div>
    </TabsContent>
  );

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Curated • Updated daily
          </motion.div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            <span className="text-zinc-100">Your</span><br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Feed Reader</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">Curated content from the tech and startup world — essays, news, trending repos, all in one place.</p>
          <motion.div className="mt-10 flex flex-wrap gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {Object.entries(sourceMeta).map(([key, meta]) => (
              <button key={key} onClick={() => handleTabChange(key)}
                className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  activeTab === key ? "border-violet-500/60 bg-violet-500/15 text-violet-300" : "border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                )}>
                {meta.icon}{meta.label}
              </button>
            ))}
            {urlCustomfeeds.length > 0 && (
              <button onClick={() => handleTabChange("urlFeed")}
                className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  activeTab === "urlFeed" ? "border-lime-500/60 bg-lime-500/15 text-lime-300" : "border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                )}>
                <Rss className="h-3.5 w-3.5" />{customFeedName}
              </button>
            )}
          </motion.div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {isTabListFixed && <div style={{ height: tabListHeight ?? 0 }} />}
          <div ref={tabListRef} className={cn("py-3 z-30 transition-all duration-300",
            isTabListFixed ? "fixed left-0 right-0 px-4 sm:px-6 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-zinc-800/60 md:top-16 bottom-0 md:bottom-auto" : ""
          )}>
            <div className={cn(isTabListFixed ? "max-w-6xl mx-auto" : "")}>
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  {tabItems.map(({ value, icon, label }) => (
                    <TabsTrigger key={value} value={value}
                      className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-zinc-500 hover:text-zinc-200",
                        "data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
                      )}>
                      {icon && (typeof icon === "string"
                        ? <Image src={icon} width={16} height={16} alt={label} className="rounded-sm" />
                        : React.createElement(icon as React.ComponentType<{ className: string }>, { className: "h-4 w-4" })
                      )}
                      {label}
                    </TabsTrigger>
                  ))}
                  <TabsTrigger value="urlFeed"
                    className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      urlCustomfeeds.length > 0
                        ? "text-lime-400 data-[state=active]:bg-lime-500/15 data-[state=active]:text-lime-300"
                        : "text-zinc-500 hover:text-zinc-200 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
                    )}>
                    {urlCustomfeeds.length > 0 ? <><Rss className="h-4 w-4" />{customFeedName}</> : <AddFeedDialog onFeedAdded={() => {}} />}
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <div className="mt-4 mb-6">
            <FeedSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          <TabSection value="techCrunch"      items={filteredTC}    emptyMsg="Unable to load TechCrunch articles." />
          <TabSection value="entrepreneur"    items={filteredEnt}   emptyMsg="Unable to load Entrepreneur articles." />
          <TabSection value="startupMagazine" items={filteredSM}    emptyMsg="Unable to load Startup Magazine articles." />
          <TabSection value="paulGraham"      items={filteredPG}    emptyMsg="Unable to load Paul Graham essays." />
          <TabSection value="simonWillison"   items={filteredSimon} emptyMsg="Unable to load Simon Willison essays." />

          <TabsContent value="githubTrending" className="mt-0 outline-none focus-visible:ring-0">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <SourceHeader tabValue="githubTrending" />
              {isLoading ? <FeedSkeleton /> : filteredGH.length === 0 && searchQuery ? <EmptyState query={searchQuery} />
                : filteredGH.length > 0 ? <TrendingRepoList repos={filteredGH} />
                : <p className="text-zinc-500 py-10 text-center text-sm">Unable to load GitHub trending repositories.</p>}
            </div>
          </TabsContent>

          <TabsContent value="urlFeed" className="mt-0 outline-none focus-visible:ring-0">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl border border-lime-500/20 bg-lime-500/5">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-lime-500 to-green-600 text-white shrink-0"><Rss className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{customFeedName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{urlCustomfeeds.length} item{urlCustomfeeds.length !== 1 ? "s" : ""} loaded</p>
                </div>
              </div>
              {isLoading ? <FeedSkeleton />
                : filteredCustom.length === 0 && searchQuery ? <EmptyState query={searchQuery} />
                : filteredCustom.length > 0 ? (
                  <FeedList items={filteredCustom.map((feed) => ({
                    title: feed.title, link: feed.link, pubDate: new Date(feed.pubDate),
                    contentSnippet: feed.contentSnippet, categories: feed.categories || [],
                    author: feed.author, imageUrl: feed.imageUrl, content: feed.content,
                  }))} />
                ) : (
                  <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center"><Rss className="h-6 w-6 text-zinc-600" /></div>
                    <div>
                      <p className="text-zinc-400 font-medium">No custom feed yet</p>
                      <p className="text-zinc-600 text-sm mt-1">Add a publication or blog via RSS to get started.</p>
                    </div>
                    <AddFeedDialog onFeedAdded={() => {}} />
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}