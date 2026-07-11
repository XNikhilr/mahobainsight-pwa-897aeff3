import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useBookmarks } from "@/lib/bookmarks";
import { LogOut, LogIn, Bookmark, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Mahoba Insight" }] }),
  component: Profile,
});

function Profile() {
  const { user, logout, loading } = useAuth();
  const bookmarks = useBookmarks();

  return (
    <AppShell title="Profile">
      <div className="p-4">
        {loading ? (
          <div className="animate-pulse rounded-2xl border border-border p-6"><div className="h-6 w-40 rounded bg-muted" /></div>
        ) : user ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground font-serif text-lg font-bold">{user.displayName[0]?.toUpperCase()}</div>
              <div className="min-w-0">
                <div className="truncate font-serif text-lg font-bold">{user.displayName}</div>
                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <button onClick={logout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
              <LogOut className="h-4 w-4" />Sign out
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground"><UserIcon className="h-6 w-6" /></div>
            <h2 className="mt-3 font-serif text-lg font-bold">Not signed in</h2>
            <p className="mt-1 text-xs text-muted-foreground">Sign in to sync bookmarks and comment.</p>
            <Link to="/login" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><LogIn className="h-4 w-4" />Sign in</Link>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <div className="font-serif text-base font-bold">Bookmarks</div>
            <div className="ml-auto text-xs text-muted-foreground">{bookmarks.length}</div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Saved articles are available offline for reading.</p>
        </div>
      </div>
    </AppShell>
  );
}