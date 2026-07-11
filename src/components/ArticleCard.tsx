import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";
import { featuredImage, postCategory, stripHtml, type WPPost } from "@/lib/wp";

interface Props { post: WPPost; variant?: "hero" | "card" | "row"; index?: number; }

export function ArticleCard({ post, variant = "card", index = 0 }: Props) {
  const img = featuredImage(post, variant === "hero" ? "large" : "medium_large");
  const cat = postCategory(post);
  const title = stripHtml(post.title.rendered);
  const time = formatDistanceToNowStrict(new Date(post.date), { addSuffix: true });

  if (variant === "row") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
        <Link to="/article/$slug" params={{ slug: post.slug }} className="flex gap-3 py-3 active:opacity-70">
          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
            {img && <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            {cat && <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{cat.name}</div>}
            <h3 className="mt-1 line-clamp-3 font-serif text-[15px] font-semibold leading-snug">{title}</h3>
            <div className="mt-1.5 text-[11px] text-muted-foreground">{time}</div>
          </div>
        </Link>
      </motion.div>
    );
  }

  const isHero = variant === "hero";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link to="/article/$slug" params={{ slug: post.slug }} className="block active:opacity-70">
        <div className={`relative w-full overflow-hidden rounded-2xl bg-muted ${isHero ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
          {img && <img src={img} alt="" loading={isHero ? "eager" : "lazy"} className="h-full w-full object-cover" />}
          {isHero && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                {cat && <span className="inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>}
                <h2 className="mt-3 font-serif text-2xl font-bold leading-tight">{title}</h2>
                <div className="mt-2 text-xs text-white/75">{time}</div>
              </div>
            </>
          )}
        </div>
        {!isHero && (
          <div className="mt-3">
            {cat && <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{cat.name}</div>}
            <h3 className="mt-1 line-clamp-3 font-serif text-lg font-semibold leading-snug">{title}</h3>
            <div className="mt-1.5 text-[11px] text-muted-foreground">{time}</div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}