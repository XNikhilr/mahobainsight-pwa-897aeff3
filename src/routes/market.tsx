import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "Markets — Mahoba Insight" }, { name: "description", content: "Live crypto and currency markets." }] }),
  component: Market,
});

interface CryptoRow { id: string; symbol: string; name: string; current_price: number; price_change_percentage_24h: number; image: string; }

async function fetchCrypto(): Promise<CryptoRow[]> {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,cardano,dogecoin&order=market_cap_desc");
  if (!res.ok) throw new Error("crypto");
  return res.json();
}
async function fetchFX(): Promise<Record<string, number>> {
  const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP,JPY,AUD,CAD,CHF,SGD");
  if (!res.ok) throw new Error("fx");
  const j = await res.json();
  return j.rates;
}
async function fetchMetals(): Promise<{ gold: number; silver: number } | null> {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU");
    const g = await res.json();
    const res2 = await fetch("https://api.gold-api.com/price/XAG");
    const s = await res2.json();
    return { gold: g.price, silver: s.price };
  } catch { return null; }
}

function ChangeBadge({ v }: { v: number }) {
  const up = v >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
      {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {v.toFixed(2)}%
    </span>
  );
}

function fmt(n: number, d = 2) { return n.toLocaleString("en-IN", { maximumFractionDigits: d }); }

function Market() {
  const crypto = useQuery({ queryKey: ["crypto"], queryFn: fetchCrypto, refetchInterval: 60_000 });
  const fx = useQuery({ queryKey: ["fx"], queryFn: fetchFX, refetchInterval: 5 * 60_000 });
  const metals = useQuery({ queryKey: ["metals"], queryFn: fetchMetals, refetchInterval: 5 * 60_000 });

  const top = crypto.data?.slice(0, 3) ?? [];

  return (
    <AppShell title="Markets">
      <div className="space-y-6 p-4">
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-bold">At a Glance</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {top.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <img src={c.image} alt="" className="h-5 w-5" />
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{c.symbol}</div>
                </div>
                <div className="mt-2 font-serif text-lg font-bold">₹{fmt(c.current_price, 0)}</div>
                <ChangeBadge v={c.price_change_percentage_24h ?? 0} />
              </motion.div>
            ))}
            {metals.data && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Gold / oz</div>
                <div className="mt-2 font-serif text-lg font-bold">${fmt(metals.data.gold, 0)}</div>
                <div className="text-xs text-muted-foreground">Silver ${fmt(metals.data.silver, 2)}</div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-2 font-serif text-xl font-bold">Cryptocurrencies</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {(crypto.data ?? []).map((c) => (
              <div key={c.id} className="flex items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0">
                <img src={c.image} alt="" className="h-8 w-8" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-serif font-bold">₹{fmt(c.current_price, 0)}</div>
                  <ChangeBadge v={c.price_change_percentage_24h ?? 0} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 font-serif text-xl font-bold">Currencies (per USD)</h2>
          <div className="grid grid-cols-2 gap-2">
            {fx.data && Object.entries(fx.data).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-sm font-semibold">USD/{k}</span>
                <span className="font-serif font-bold">{fmt(v, 2)}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="pt-2 text-center text-[11px] text-muted-foreground">
          Data: CoinGecko, Frankfurter, Gold-API. Indian equity indices coming soon.
        </p>
      </div>
    </AppShell>
  );
}