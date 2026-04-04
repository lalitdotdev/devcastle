import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Grid,
  Package,
  Sparkles,
} from "lucide-react";
import { getProductsByCategoryName } from "@/lib/launchpad-server-actions/server-actions";

interface IParams {
  category: string;
}

// Accent cycling — consistent with FeedItem, JobRow, Categories page
const ACCENTS = [
  {
    dot: "bg-violet-400",
    bar: "from-violet-500",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    dot: "bg-cyan-400",
    bar: "from-cyan-500",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    dot: "bg-emerald-400",
    bar: "from-emerald-500",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    dot: "bg-amber-400",
    bar: "from-amber-500",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    dot: "bg-rose-400",
    bar: "from-rose-500",
    glow: "group-hover:shadow-rose-500/10",
  },
  {
    dot: "bg-fuchsia-400",
    bar: "from-fuchsia-500",
    glow: "group-hover:shadow-fuchsia-500/10",
  },
];

function accentForId(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
}

const CategoryPage = async ({ params }: { params: IParams }) => {
  const capitalizedCategory =
    params.category.charAt(0).toUpperCase() + params.category.slice(1);

  const products = await getProductsByCategoryName(capitalizedCategory);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
      {/* Ambient blobs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-600/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14">
        {/* ── Breadcrumb ── */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList className="flex items-center gap-1.5 text-[11px] text-zinc-600">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="hover:text-zinc-300 transition-colors"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3 w-3 text-zinc-800" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/launchpad/categories"
                className="hover:text-zinc-300 transition-colors"
              >
                Categories
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3 w-3 text-zinc-800" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-zinc-300 font-medium">
                {capitalizedCategory}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── Hero header ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-5">
            <Grid className="h-3 w-3" />
            {products.length} product{products.length !== 1 ? "s" : ""}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] mb-3">
            <span className="text-zinc-100">{capitalizedCategory}</span>
          </h1>
          <p className="text-zinc-500 leading-relaxed">
            Discover what builders are shipping in the{" "}
            <span className="text-zinc-400">{capitalizedCategory}</span> space.
          </p>
        </div>

        {/* ── Product list ── */}
        {products.length > 0 ? (
          <>
            <div className="space-y-2">
              {products.map((product: any, i: number) => {
                const accent = accentForId(product.id);

                return (
                  <Link
                    key={product.id}
                    href={`/launchpad/product/${product.slug}`}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm
                                            hover:border-zinc-700/70 hover:bg-zinc-900/70
                                            hover:shadow-xl ${accent.glow}
                                            transition-all duration-300 overflow-hidden`}
                  >
                    {/* Left accent stripe */}
                    <div
                      className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${accent.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    {/* Timeline-style dot */}
                    <div className="hidden sm:block absolute -left-[27px]">
                      <div className="h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-950 flex items-center justify-center">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                        />
                      </div>
                    </div>

                    {/* Logo */}
                    <div className="shrink-0 h-12 w-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                      <Image
                        src={product.logo}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug truncate">
                        {product.name}
                      </h2>
                      <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 leading-relaxed">
                        {product.headline}
                      </p>
                    </div>

                    {/* Arrow — revealed on hover */}
                    <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 group-hover:text-zinc-200 group-hover:border-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* End cap */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-700 mt-8">
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                <Sparkles className="h-3 w-3" />
                {products.length} product{products.length !== 1 ? "s" : ""} in{" "}
                {capitalizedCategory}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-4 py-20 text-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Package className="h-6 w-6 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">
                No products in {capitalizedCategory} yet
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Be the first to launch something here.
              </p>
            </div>
            <Link
              href="/launchpad/new-product"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold
                                bg-gradient-to-r from-violet-600 to-fuchsia-600
                                hover:from-violet-500 hover:to-fuchsia-500
                                text-white shadow-lg shadow-violet-900/30
                                transition-all duration-200 mt-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Submit a product
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;
