import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SkeletonRow } from "@/components/SkeletonCard";
import { fetchPosts } from "@/lib/wp";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/local")({
  head: () => ({ meta: [{ title: "Mahoba — Local News" }, { name: "description", content: "Local news from Mahoba, Uttar Pradesh." }] }),
  component: Local,
});

function Local() {
  const q = useInfiniteQuery({
    queryKey: ["local-mahoba"],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ categorySlug: "mahoba", perPage: 10, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.length < 10 ? undefined : all.length + 1),
  });
  const posts = q.data?.pages.flat() ?? [];
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting && q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage(); }, { rootMargin: "400px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [q.hasNextPage, q.isFetchingNextPage]);

  return (
    <AppShell title="Local · Mahoba">
      <div className="border-b border-border bg-gradient-to-br from-primary/10 via-primary/5 to-background px-4 py-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
          <MapPin className="h-3.5 w-3.5" />Uttar Pradesh · District
        </div>
        <h1 className="mt-1 font-serif text-3xl font-black tracking-tight">Mahoba</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything happening in your district.</p>
      </div>
      <div className="divide-y divide-border/70 px-4">
        {q.isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="py-3"><SkeletonRow /></div>)
        ) : posts.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No local articles found.</div>
        ) : (
          posts.map((p, i) => <ArticleCard key={p.id} post={p} variant="row" index={i} />)
        )}
      </div>
      <div ref={sentinel} className="h-16" />
      {q.isFetchingNextPage && <div className="px-4 pb-4"><SkeletonRow /></div>}
    </AppShell>
  );
}