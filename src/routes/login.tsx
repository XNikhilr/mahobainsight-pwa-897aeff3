import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Mahoba Insight" }] }),
  component: Login,
});

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) {
    return <AppShell title="Sign in"><div className="p-6 text-center text-sm">You're already signed in. <Link to="/profile" className="text-primary underline">Go to profile</Link></div></AppShell>;
  }

  return (
    <AppShell title="Sign in">
      <div className="mx-auto max-w-sm p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25"><LogIn className="h-6 w-6" /></div>
          <h1 className="mt-4 font-serif text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in with your Mahoba Insight account.</p>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault(); setBusy(true); setErr(null);
            try { await login(u, p); navigate({ to: "/profile" }); }
            catch (e: any) { setErr(e.message ?? "Login failed"); }
            finally { setBusy(false); }
          }}
          className="space-y-3"
        >
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username or email" required autoComplete="username" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={p} onChange={(e) => setP(e.target.value)} type="password" placeholder="Password" required autoComplete="current-password" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          {err && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
          <button disabled={busy} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </AppShell>
  );
}