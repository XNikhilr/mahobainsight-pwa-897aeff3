import { useQuery } from "@tanstack/react-query";
import { fetchPosts, stripHtml } from "@/lib/wp";
import { Zap } from "lucide-react";

export function BreakingTicker() {
  const { data } = useQuery({
    queryKey: ["ticker"],
    queryFn: () => fetchPosts({ perPage: 8 }),
    staleTime: 60_000,
  });
  const items = data?.map((p) => stripHtml(p.title.rendered)) ?? [];
  if (!items.length) return null;
  const seq = [...items, ...items];
  return (
    <div className="flex items-stretch overflow-hidden border-y border-border bg-primary/5">
      <div className="flex items-center gap-1.5 bg-primary px-3 text-primary-foreground">
        <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
      </div>
      <div className="relative flex-1 overflow-hidden py-2">
        <div className="ticker-scroll flex gap-8 whitespace-nowrap text-[13px] font-medium">
          {seq.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-8">
              <span>{t}</span>
              <span className="text-muted-foreground">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}