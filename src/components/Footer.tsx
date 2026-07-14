import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Globe } from "lucide-react";
import mahobaLogo from "@/assets/brand/mahoba-logo.png";
import parentFirm from "@/assets/brand/parent-firm.png";

const SECTIONS: { label: string; href: string; external?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "Local · Mahoba", href: "/local" },
  { label: "Markets", href: "/market" },
  { label: "Weather", href: "/weather" },
];

const EDITORIAL: { label: string; slug: string }[] = [
  { label: "Uttar Pradesh", slug: "uttar-pradesh" },
  { label: "Madhya Pradesh", slug: "madhya-pradesh" },
  { label: "National", slug: "national" },
  { label: "International", slug: "international" },
  { label: "Politics", slug: "politics" },
  { label: "Legal & Law", slug: "legal-law" },
  { label: "Religious", slug: "religious" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.914l-4.79-6.26L5.8 22H2.54l8.03-9.17L1.5 2h7.086l4.32 5.71L18.244 2zm-2.42 18h1.916L7.27 4h-2.06l10.615 16z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-border bg-card/40">
      {/* Top: brand */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <img
            src={mahobaLogo}
            alt="Mahoba Insight"
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 rounded-lg object-contain ring-1 ring-border"
          />
          <div className="leading-tight">
            <div className="font-serif text-lg font-black tracking-tight">Mahoba Insight</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">The Daily Brief</div>
          </div>
        </div>
        <p className="mt-4 max-w-sm font-serif text-[13px] leading-relaxed text-muted-foreground">
          Independent journalism from Mahoba to the world — breaking news, politics, business and culture, reported without fear or favour.
        </p>

        {/* Social */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <a href="https://www.facebook.com/share/176S3RBRkU/" target="_blank" rel="noreferrer" aria-label="Facebook"
             className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="https://x.com/mahobainsight" target="_blank" rel="noreferrer" aria-label="X"
             className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <XIcon className="h-3.5 w-3.5" />
          </a>
          <a href="https://www.instagram.com/mahoba.insight" target="_blank" rel="noreferrer" aria-label="Instagram"
             className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="https://youtube.com/@mahobainsight" target="_blank" rel="noreferrer" aria-label="YouTube"
             className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Youtube className="h-4 w-4" />
          </a>
          <a href="https://mahobainsight.in/" target="_blank" rel="noreferrer" aria-label="Website"
             className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Globe className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-5 h-px bg-border" />

      {/* Sections */}
      <div className="grid grid-cols-2 gap-6 px-5 py-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">App</div>
          <ul className="mt-3 space-y-2 text-[13px]">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link to={s.href} className="text-foreground/85 hover:text-primary">{s.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/profile" className="text-foreground/85 hover:text-primary">Profile</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Sections</div>
          <ul className="mt-3 space-y-2 text-[13px]">
            {EDITORIAL.map((s) => (
              <li key={s.slug}>
                <Link to="/category/$slug" params={{ slug: s.slug }} className="text-foreground/85 hover:text-primary">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-5 h-px bg-border" />

      {/* Parent firm */}
      <div className="px-5 py-6">
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">— Parent Firm —</div>
        <div className="mt-3 flex justify-center">
          <img
            src={parentFirm}
            alt="Parent firm"
            width={140}
            height={56}
            loading="lazy"
            decoding="async"
            className="h-14 w-auto opacity-90 dark:brightness-110 dark:invert"
          />
        </div>
      </div>

      <div className="mx-5 h-px bg-border" />

      {/* Legal */}
      <div className="px-5 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <Link to="/info/$slug" params={{ slug: "about" }} className="hover:text-primary">About</Link>
          <span className="opacity-40">·</span>
          <Link to="/info/$slug" params={{ slug: "contact" }} className="hover:text-primary">Contact</Link>
          <span className="opacity-40">·</span>
          <Link to="/info/$slug" params={{ slug: "privacy" }} className="hover:text-primary">Privacy</Link>
          <span className="opacity-40">·</span>
          <Link to="/info/$slug" params={{ slug: "terms" }} className="hover:text-primary">Terms</Link>
        </div>
        <div className="mt-3 text-center text-[11px] text-muted-foreground">
          © {year} Mahoba Insight. All rights reserved.
        </div>
      </div>
    </footer>
  );
}