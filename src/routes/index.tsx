import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { BreakingTicker } from "@/components/BreakingTicker";
import { CategoryRow } from "@/components/CategoryRow";
import { CategoryChips } from "@/components/CategoryChips";
import { SkeletonCard, SkeletonRow } from "@/components/SkeletonCard";
import { fetchPosts } from "@/lib/wp";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const SECTIONS: { slug: string; title: string }[] = [
  { slug: "politics", title: "Politics" },
  { slug: "business", title: "Business" },
  { slug: "technology", title: "Technology" },
  { slug: "india", title: "India" },
  { slug: "world", title: "World" },
  { slug: "sports", title: "Sports" },
  { slug: "entertainment", title: "Entertainment" },
  { slug: "opinion", title: "Opinion" },
];

function Home() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ["home-feed"],
      queryFn: ({ pageParam = 1 }) => fetchPosts({ perPage: 10, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (last, all) => (last.length < 10 ? undefined : all.length + 1),
    });

  const posts = data?.pages.flat() ?? [];
  const hero = posts[0];
  const secondary = posts.slice(1, 4);
  const latest = posts.slice(4);

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: "400px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Pull-to-refresh (simple)
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  useEffect(() => {
    const onStart = (e: TouchEvent) => { if (window.scrollY <= 0) startY.current = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => {
      if (startY.current == null) return;
      const d = e.touches[0].clientY - startY.current;
      if (d > 0) setPull(Math.min(80, d * 0.5));
    };
    const onEnd = () => {
      if (pull > 60) refetch();
      setPull(0); startY.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [pull, refetch]);

  return (
    <AppShell>
      <div style={{ transform: `translateY(${pull}px)`, transition: pull ? "none" : "transform 200ms" }}>
        {(pull > 20 || isRefetching) && (
          <div className="flex justify-center py-2 text-muted-foreground">
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </div>
        )}
        <BreakingTicker />
        <CategoryChips />

        {isLoading ? (
          <div className="space-y-6 p-4">
            <SkeletonCard tall />
            {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : (
          <>
            {hero && (
              <div className="p-4">
                <ArticleCard post={hero} variant="hero" />
              </div>
            )}

            {secondary.length > 0 && (
              <section className="px-4 pb-2">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="font-serif text-xl font-bold tracking-tight">Top Stories</h2>
                </div>
                <div className="divide-y divide-border/70">
                  {secondary.map((p, i) => <ArticleCard key={p.id} post={p} variant="row" index={i} />)}
                </div>
              </section>
            )}

            <div className="my-2 h-px bg-border" />

            <section className="px-4 py-4">
              <h2 className="mb-3 font-serif text-xl font-bold tracking-tight">Latest</h2>
              <div className="divide-y divide-border/70">
                {latest.map((p, i) => <ArticleCard key={p.id} post={p} variant="row" index={i} />)}
              </div>
            </section>

            {SECTIONS.map((s) => <CategoryRow key={s.slug} slug={s.slug} title={s.title} />)}

            <div ref={sentinel} className="h-16" />
            {isFetchingNextPage && (
              <div className="px-4 pb-4">
                <SkeletonRow />
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
