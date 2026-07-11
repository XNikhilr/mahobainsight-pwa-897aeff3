import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/wp";

export function CategoryChips() {
  const { data } = useQuery({
    queryKey: ["categories-chips"],
    queryFn: () => fetchCategories(30),
    staleTime: 30 * 60_000,
  });
  const cats = data ?? [];
  if (cats.length === 0) return null;
  return (
    <nav aria-label="Categories" className="border-b border-border/60 bg-background/60">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          to="/categories"
          className="shrink-0 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground hover:bg-muted"
        >
          All
        </Link>
        {cats.map((c) => (
          <Link
            key={c.id}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
