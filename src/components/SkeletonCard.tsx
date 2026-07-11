export function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className="animate-pulse space-y-3">
      <div className={`w-full rounded-xl bg-muted ${tall ? "aspect-[4/5]" : "aspect-[16/9]"}`} />
      <div className="h-3 w-20 rounded bg-muted" />
      <div className="h-4 w-11/12 rounded bg-muted" />
      <div className="h-4 w-8/12 rounded bg-muted" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-pulse gap-3">
      <div className="h-20 w-24 shrink-0 rounded-lg bg-muted" />
      <div className="min-w-0 flex-1 space-y-2 py-1">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-4 w-11/12 rounded bg-muted" />
        <div className="h-4 w-7/12 rounded bg-muted" />
      </div>
    </div>
  );
}