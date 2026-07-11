import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { fetchCategories } from "@/lib/wp";
import { SkeletonRow } from "@/components/SkeletonCard";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Mahoba Insight" },
      { name: "description", content: "Browse all news categories on Mahoba Insight." },
    ],
  }),
});

function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => fetchCategories(100),
    staleTime: 30 * 60_000,
  });

  return (
    <AppShell title="Categories">
      <div className="p-4">
        <h1 className="mb-4 font-serif text-2xl font-bold tracking-tight">All Categories</h1>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {(data ?? []).map((c) => (
              <li key={c.id}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="flex h-full flex-col rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted"
                >
                  <span className="font-serif text-base font-bold tracking-tight">{c.name}</span>
                  <span className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{c.count} posts</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
