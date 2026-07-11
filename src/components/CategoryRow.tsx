import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchPosts } from "@/lib/wp";
import { ArticleCard } from "./ArticleCard";
import { SkeletonRow } from "./SkeletonCard";

export function CategoryRow({ slug, title }: { slug: string; title: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["cat", slug],
    queryFn: () => fetchPosts({ categorySlug: slug, perPage: 5 }),
    staleTime: 5 * 60_000,
  });

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section className="px-4 py-4">
      <div className="mb-2 flex items-baseline justify-between">
        <Link to="/category/$slug" params={{ slug }} className="font-serif text-xl font-bold tracking-tight hover:underline">{title}</Link>
        <Link to="/category/$slug" params={{ slug }} className="text-[10px] font-bold uppercase tracking-widest text-primary">See all →</Link>
      </div>
      <div className="divide-y divide-border/70">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="py-3"><SkeletonRow /></div>)
          : data!.map((p, i) => <ArticleCard key={p.id} post={p} variant="row" index={i} />)}
      </div>
    </section>
  );
}