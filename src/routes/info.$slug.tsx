import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";

const PAGES: Record<string, { title: string; body: ReactNode }> = {
  about: {
    title: "About Mahoba Insight",
    body: (
      <>
        <p>
          Mahoba Insight is an independent digital newsroom reporting from the
          heart of Bundelkhand — covering Uttar Pradesh, Madhya Pradesh and
          national affairs with clarity, courage and craft.
        </p>
        <p>
          Our mission is simple: bring readers accurate, fast and fearless
          journalism, free of corporate or political influence.
        </p>
      </>
    ),
  },
  contact: {
    title: "Contact Us",
    body: (
      <>
        <p>Newsroom &amp; tips: <a href="mailto:desk@mahobainsight.in">desk@mahobainsight.in</a></p>
        <p>Advertising: <a href="mailto:ads@mahobainsight.in">ads@mahobainsight.in</a></p>
        <p>General: <a href="mailto:hello@mahobainsight.in">hello@mahobainsight.in</a></p>
        <p>Mahoba, Uttar Pradesh, India.</p>
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p>
          We respect your privacy. Mahoba Insight collects only the minimum
          information required to deliver news — such as anonymous analytics and,
          if you sign in, your account details.
        </p>
        <p>
          We never sell personal data. Bookmarks and preferences are stored
          locally on your device.
        </p>
      </>
    ),
  },
  terms: {
    title: "Terms of Use",
    body: (
      <>
        <p>
          By using Mahoba Insight you agree to use the service lawfully and
          respectfully. All content is © Mahoba Insight unless otherwise noted
          and may not be reproduced without permission.
        </p>
        <p>
          We may update these terms from time to time. Continued use of the app
          means acceptance of the latest version.
        </p>
      </>
    ),
  },
};

export const Route = createFileRoute("/info/$slug")({
  head: ({ params }) => {
    const page = PAGES[params.slug];
    const title = page ? `${page.title} — Mahoba Insight` : "Mahoba Insight";
    return { meta: [{ title }, { name: "description", content: page?.title ?? "Mahoba Insight" }] };
  },
  loader: ({ params }) => {
    if (!PAGES[params.slug]) throw notFound();
    return null;
  },
  component: InfoPage,
  notFoundComponent: () => (
    <AppShell><div className="p-10 text-center text-muted-foreground">Page not found.</div></AppShell>
  ),
  errorComponent: () => (
    <AppShell><div className="p-10 text-center text-muted-foreground">Something went wrong.</div></AppShell>
  ),
});

function InfoPage() {
  const { slug } = Route.useParams();
  const page = PAGES[slug]!;
  return (
    <AppShell>
      <div className="sticky top-14 z-30 flex items-center gap-2 border-b border-border/60 bg-background/85 px-2 py-2 backdrop-blur-xl">
        <Link to="/" aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{page.title}</div>
      </div>
      <div className="px-5 py-6">
        <h1 className="font-serif text-3xl font-black leading-tight tracking-tight">{page.title}</h1>
        <div className="prose prose-neutral dark:prose-invert mt-5 max-w-none font-serif prose-a:text-primary" style={{ lineHeight: 1.7 }}>
          {page.body}
        </div>
      </div>
    </AppShell>
  );
}