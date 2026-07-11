import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ArrowLeft, Globe, Mail, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { SkeletonRow } from "@/components/SkeletonCard";
import { fetchAuthor, fetchPostsByAuthor, stripHtml } from "@/lib/wp";

export const Route = createFileRoute("/author/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Author · Mahoba Insight` },
      { name: "description", content: `Profile and stories by author #${params.id} on Mahoba Insight.` },
    ],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  const { id } = Route.useParams();
  const authorId = Number(id);
  const router = useRouter();

  const { data: author, isLoading } = useQuery({
    queryKey: ["author", authorId],
    queryFn: () => fetchAuthor(authorId),
    staleTime: 5 * 60_000,
  });

  const posts = useInfiniteQuery({
    queryKey: ["author-posts", authorId],
    queryFn: ({ pageParam = 1 }) => fetchPostsByAuthor(authorId, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.length < 10 ? undefined : all.length + 1),
  });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && posts.hasNextPage && !posts.isFetchingNextPage) posts.fetchNextPage();
    }, { rootMargin: "400px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [posts.hasNextPage, posts.isFetchingNextPage, posts.fetchNextPage]);

  const avatar =
    author?.avatar_urls?.["96"] ||
    author?.avatar_urls?.["48"] ||
    author?.avatar_urls?.["24"] ||
    null;

  const bio = author?.description ? stripHtml(author.description) : "";
  const all = posts.data?.pages.flat() ?? [];

  return (
    <AppShell>
      <div className="sticky top-14 z-30 flex items-center border-b border-border/60 bg-background/85 px-2 py-2 backdrop-blur-xl">
        <button onClick={() => router.history.back()} aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="ml-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Author</div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
        <div className="relative px-5 pt-8 pb-5">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-background bg-muted">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center font-serif text-2xl font-bold text-muted-foreground">
                  {(author?.name ?? "?").slice(0, 1)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Correspondent</div>
              <h1 className="mt-1 font-serif text-2xl font-black leading-tight tracking-tight">
                {isLoading ? <span className="inline-block h-6 w-40 rounded bg-muted align-middle" /> : author?.name ?? "Unknown"}
              </h1>
              <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Newspaper className="h-3.5 w-3.5" />
                {all.length > 0 ? `${all.length}${posts.hasNextPage ? "+" : ""} stories` : "Stories"}
              </div>
            </div>
          </div>

          {bio && (
            <p className="mt-5 font-serif text-[15px] leading-relaxed text-foreground/85">
              {bio}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {author?.url && (
              <a
                href={author.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Globe className="h-3.5 w-3.5" /> Website
              </a>
            )}
            {author?.link && (
              <a
                href={author.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Mail className="h-3.5 w-3.5" /> Full profile
              </a>
            )}
          </div>
        </div>
      </motion.section>

      <div className="mx-4 my-2 h-px bg-border" />

      <section className="px-4 pb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-xl font-bold tracking-tight">Latest by {author?.name?.split(" ")[0] ?? "author"}</h2>
        </div>

        {posts.isLoading && all.length === 0 ? (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : all.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No stories published yet.
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {all.map((p, i) => <ArticleCard key={p.id} post={p} variant="row" index={i} />)}
          </div>
        )}

        <div ref={sentinel} className="h-16" />
        {posts.isFetchingNextPage && <SkeletonRow />}

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs font-medium text-primary hover:underline">
            ← Back to today's brief
          </Link>
        </div>
      </section>
    </AppShell>
  );
}