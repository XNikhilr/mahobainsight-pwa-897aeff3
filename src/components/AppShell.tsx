import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://www.mahobainsight.in/wp-content/uploads/2026/03/Screenshot_20231029_084907_Chrome.png" alt="Mahoba Insight" className="h-7 w-7 rounded-md object-contain" />
            <div className="leading-tight">
              <div className="font-serif text-[15px] font-bold tracking-tight">{title ?? "Mahoba Insight"}</div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">The Daily Brief</div>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={toggle} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <Link to="/profile" aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <User className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-md pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}