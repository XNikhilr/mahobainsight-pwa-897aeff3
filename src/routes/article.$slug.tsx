import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Share2, Type, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { fetchPostBySlug, fetchPosts, readCachedPost, featuredImage, postCategory, postAuthor, stripHtml, estimateReadingTime } from "@/lib/wp";
import { sharePost } from "@/lib/share";
import { useBookmark } from "@/lib/bookmarks";
import { ArticleCard } from "@/components/ArticleCard";

export const Route = createFileRoute("/article/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Mahoba Insight` }, { property: "og:type", content: "article" }],
  }),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const router = useRouter();
  const cached = typeof window !== "undefined" ? readCachedPost(slug) : null;
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug),
    initialData: cached ?? undefined,
  });

  const cat = post ? postCategory(post) : null;
  const { data: related } = useQuery({
    queryKey: ["related", cat?.slug],
    queryFn: () => fetchPosts({ categorySlug: cat!.slug, perPage: 4 }),
    enabled: !!cat,
  });

  const [fontStep, setFontStep] = useState(0);
  useEffect(() => { const s = localStorage.getItem("fontStep"); if (s) setFontStep(parseInt(s)); }, []);
  useEffect(() => { localStorage.setItem("fontStep", String(fontStep)); }, [fontStep]);

  const bm = useBookmark(post?.id ?? 0);

  if (isLoading && !post) {
    return <AppShell><div className="animate-pulse p-4 space-y-4">
      <div className="aspect-[16/10] w-full rounded-2xl bg-muted" />
      <div className="h-8 w-full rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="space-y-2 pt-2">{Array.from({length:8}).map((_,i)=><div key={i} className="h-3 w-full rounded bg-muted" />)}</div>
    </div></AppShell>;
  }
  if (!post) return <AppShell><div className="p-10 text-center text-muted-foreground">Article not found.</div></AppShell>;

  const img = featuredImage(post, "large");
  const author = postAuthor(post);
  const title = stripHtml(post.title.rendered);
  const read = estimateReadingTime(post.content.rendered);
  const publish = new Date(post.date);
  const updated = new Date(post.modified);
  const fontSizes = ["prose-sm", "prose-base", "prose-lg"];
  const filtered = related?.filter((r) => r.id !== post.id).slice(0, 3) ?? [];

  return (
    <AppShell>
      <article className="pb-8">
        <div className="sticky top-14 z-30 flex items-center justify-between border-b border-border/60 bg-background/85 px-2 py-2 backdrop-blur-xl">
          <button onClick={() => router.history.back()} aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
          <div className="flex gap-1">
            <button onClick={() => setFontStep((s) => (s + 1) % 3)} aria-label="Font size" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Type className="h-5 w-5" /></button>
            <button onClick={bm.toggle} aria-label="Bookmark" className={`grid h-9 w-9 place-items-center rounded-full hover:bg-muted ${bm.on ? "text-primary" : ""}`}>
              <Bookmark className="h-5 w-5" fill={bm.on ? "currentColor" : "none"} />
            </button>
            <button onClick={() => sharePost(post)} aria-label="Share" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Share2 className="h-5 w-5" /></button>
          </div>
        </div>

        {img && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <img src={img} alt="" className="h-full w-full object-cover" />
          </motion.div>
        )}

        <div className="px-4 pt-5">
          {cat && <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{cat.name}</div>}
          <h1 className="mt-2 font-serif text-3xl font-black leading-tight tracking-tight">{title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {author && <span className="font-semibold text-foreground">{author.name}</span>}
            <span>{publish.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{read} min read</span>
          </div>
          {publish.getTime() !== updated.getTime() && (
            <div className="mt-1 text-[11px] italic text-muted-foreground">Updated {updated.toLocaleString("en", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
          )}

          <div
            className={`prose prose-neutral dark:prose-invert mt-6 max-w-none ${fontSizes[fontStep]} font-serif prose-headings:font-serif prose-a:text-primary prose-img:rounded-xl`}
            style={{ lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {filtered.length > 0 && (
            <section className="mt-10 border-t border-border pt-6">
              <h3 className="mb-3 font-serif text-xl font-bold">Related Stories</h3>
              <div className="divide-y divide-border/70">
                {filtered.map((r, i) => <ArticleCard key={r.id} post={r} variant="row" index={i} />)}
              </div>
            </section>
          )}

          <div className="mt-8 flex justify-center">
            <button onClick={() => sharePost(post)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 active:scale-95">
              <Share2 className="h-4 w-4" /> Share this story
            </button>
          </div>
        </div>
      </article>
    </AppShell>
  );
}