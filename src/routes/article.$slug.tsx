import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Share2, Type, Clock, BadgeCheck, Link2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { fetchPostBySlug, fetchPosts, readCachedPost, featuredImage, postCategory, postAuthor, stripHtml, estimateReadingTime } from "@/lib/wp";
import { sharePost, buildShareText } from "@/lib/share";
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
  const qc = useQueryClient();
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
  const [copied, setCopied] = useState(false);

  // Prefetch the next related article + warm its hero image so the transition feels instant.
  const nextRelated = related?.find((r) => r.id !== post?.id) ?? null;
  useEffect(() => {
    if (!nextRelated) return;
    qc.prefetchQuery({
      queryKey: ["post", nextRelated.slug],
      queryFn: () => fetchPostBySlug(nextRelated.slug),
    });
    const heroUrl = featuredImage(nextRelated, "large");
    if (heroUrl) {
      const img = new Image();
      img.decoding = "async";
      img.src = heroUrl;
    }
  }, [nextRelated?.id, qc]);

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

  const shareUrl = post.link;
  const shareText = buildShareText(post);
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

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
            {author && (
              <Link
                to="/author/$id"
                params={{ id: String(author.id) }}
                className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary"
              >
                {author.avatar_urls?.["48"] && (
                  <img src={author.avatar_urls["48"]} alt="" className="h-6 w-6 rounded-full object-cover" />
                )}
                <span className="inline-flex items-center gap-1">
                  {author.name}
                  <BadgeCheck className="h-4 w-4 fill-primary text-primary-foreground" aria-label="Verified author" />
                </span>
              </Link>
            )}
            <span>{publish.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{read} min read</span>
          </div>
          {publish.getTime() !== updated.getTime() && (
            <div className="mt-1 text-[11px] italic text-muted-foreground">Updated {updated.toLocaleString("en", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
          )}

          <div className="mt-4 flex items-center gap-2 border-y border-border/60 py-3">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Share</span>
            <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366]/10 text-[#128C7E] active:scale-95 transition">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.48 0 .13 5.35.13 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.79 1.48h.01c6.58 0 11.93-5.35 11.93-11.94 0-3.19-1.24-6.19-3.48-8.42zM12.07 21.8h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.72.97.99-3.62-.24-.37a9.86 9.86 0 0 1-1.51-5.25c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 6.99 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.86-9.92 9.86zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
            </a>
            <a href={xHref} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="grid h-9 w-9 place-items-center rounded-full bg-foreground/5 text-foreground active:scale-95 transition">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.573L23 22h-6.828l-5.34-6.986L4.72 22H1.46l8.02-9.167L1 2h6.914l4.826 6.383L18.244 2Zm-1.2 18h1.84L7.05 4H5.09l11.954 16Z"/></svg>
            </a>
            <a href={fbHref} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-[#1877F2]/10 text-[#1877F2] active:scale-95 transition">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8V14h2.7v8h3Z"/></svg>
            </a>
            <button onClick={copyLink} aria-label="Copy link" className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground active:scale-95 transition">
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
            </button>
            <button onClick={() => sharePost(post)} aria-label="More share options" className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground active:scale-95 transition">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

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