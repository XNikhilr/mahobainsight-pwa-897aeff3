import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import headerLogo from "@/assets/brand/header-logo.svg";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={headerLogo}
              alt={title ?? "Mahoba Insight"}
              width={120}
              height={32}
              decoding="async"
              fetchPriority="high"
              className="h-8 w-auto dark:invert dark:brightness-110"
            />
            {title && (
              <span className="hidden font-serif text-[15px] font-bold tracking-tight sm:inline">{title}</span>
            )}
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
      <main className="mx-auto max-w-md pb-24">
        {children}
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}