import { Link, useRouterState } from "@tanstack/react-router";
import { Home, TrendingUp, CloudSun, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/market", label: "Market", icon: TrendingUp },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/local", label: "Local", icon: MapPin },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/85 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {tabs.map((t) => {
          const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link to={t.to} className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium" aria-label={t.label}>
                {active && (
                  <motion.span
                    layoutId="tabPill"
                    className="absolute inset-x-4 top-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon className={`h-6 w-6 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={active ? 2.2 : 1.7} />
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}