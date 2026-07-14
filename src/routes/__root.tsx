import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { OnlineSync } from "@/lib/online-sync";
import { registerSW } from "@/lib/sw-register";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Mahoba Insight — Breaking News, Politics, Business & Local" },
      { name: "description", content: "Premium news app for Mahoba Insight. Breaking news, politics, business, local Mahoba updates, markets and weather — designed like Reuters." },
      { name: "theme-color", content: "#c92a2a" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Mahoba Insight" },
      { property: "og:title", content: "Mahoba Insight — The Daily Brief" },
      { property: "og:description", content: "Reuters-style news app for Mahoba, India and the world." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Mahoba Insight" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "https://www.mahobainsight.in/wp-content/uploads/2026/03/Screenshot_20231029_084907_Chrome.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "https://www.mahobainsight.in/wp-content/uploads/2026/03/Screenshot_20231029_084907_Chrome.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://mahobainsight.in" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700;8..60,900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => { registerSW(); }, []);

  // Global interceptor: any click on an <a> pointing at mahobainsight.in
  // stays inside the PWA by routing to the closest internal equivalent.
  useEffect(() => {
    const SITE_HOSTS = new Set(["mahobainsight.in", "www.mahobainsight.in"]);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (!SITE_HOSTS.has(url.host)) return;

      const parts = url.pathname.split("/").filter(Boolean);
      let to: string | null = null;
      let params: Record<string, string> | undefined;

      if (parts.length === 0) {
        to = "/";
      } else if (parts[0] === "category" || (parts[0] === "news" && parts[1] === "category")) {
        const slug = parts[parts[0] === "category" ? 1 : 2];
        if (slug) { to = "/category/$slug"; params = { slug }; }
      } else if (["about", "contact", "terms"].includes(parts[0])) {
        to = "/info/$slug"; params = { slug: parts[0] };
      } else if (parts[0] === "privacy-policy" || parts[0] === "privacy") {
        to = "/info/$slug"; params = { slug: "privacy" };
      } else {
        const slug = parts[parts.length - 1];
        if (slug && !slug.includes(".")) { to = "/article/$slug"; params = { slug }; }
      }

      if (!to) return;
      e.preventDefault();
      router.navigate({ to, params } as never);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <OnlineSync />
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
