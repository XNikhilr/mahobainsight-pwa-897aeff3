import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SkeletonCard, SkeletonRow } from "@/components/SkeletonCard";
import { fetchCategoryBySlug, fetchPosts } from "@/lib/wp";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  errorComponent: ({ error }) => (
    <AppShell title="Category"><div className="p-4 text-sm text-muted-foreground">{error.message}</div></AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Category"><div className="p-4">Category not found.</div></AppShell>
  ),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const router = useRouter();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchCategoryBySlug(slug),
    staleTime: 30 * 60_000,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["category-feed", slug],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ categorySlug: slug, perPage: 10, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.length < 10 ? undefined : all.length + 1),
  });

  const posts = data?.pages.flat() ?? [];
  const hero = posts[0];
  const rest = posts.slice(1);

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: "400px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const title = category?.name ?? slug.replace(/-/g, " ");

  return (
    <AppShell title={title}>
      <div className="px-4 pt-3">
        <button onClick={() => router.history.back()} className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">← Back</button>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-2xl font-bold capitalize tracking-tight">{title}</h1>
          <Link to="/categories" className="text-[11px] font-semibold uppercase tracking-widest text-primary">All categories</Link>
        </div>
        {category?.description && <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>}
      </div>

      {isLoading ? (
        <div className="space-y-4 p-4">
          <SkeletonCard tall />
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">No posts in this category yet.</div>
      ) : (
        <>
          {hero && <div className="p-4"><ArticleCard post={hero} variant="hero" /></div>}
          <section className="px-4 pb-4">
            <div className="divide-y divide-border/70">
              {rest.map((p, i) => <ArticleCard key={p.id} post={p} variant="row" index={i} />)}
            </div>
          </section>
          <div ref={sentinel} className="h-16" />
          {isFetchingNextPage && <div className="px-4 pb-4"><SkeletonRow /></div>}
        </>
      )}
    </AppShell>
  );
}
