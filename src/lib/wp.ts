const WP_BASE = "https://mahobainsight.in/wp-json/wp/v2";
export const SITE_URL = "https://mahobainsight.in";

export interface WPMedia {
  source_url: string;
  alt_text?: string;
  media_details?: { sizes?: Record<string, { source_url: string; width: number; height: number }> };
}

export interface WPTerm { id: number; name: string; slug: string; taxonomy: string; }

export interface WPCategory { id: number; name: string; slug: string; count: number; description?: string; parent?: number; }

export async function fetchCategories(perPage = 50): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>(`/categories?per_page=${perPage}&orderby=count&order=desc&hide_empty=1`);
}

export async function fetchCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const cats = await wpFetch<WPCategory[]>(`/categories?slug=${encodeURIComponent(slug)}`);
  return cats[0] ?? null;
}
export interface WPAuthor {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  url?: string;
  link?: string;
  avatar_urls?: Record<string, string>;
  verified?: boolean;
  meta?: Record<string, unknown>;
  acf?: Record<string, unknown>;
}

/**
 * True only when WordPress explicitly marks the author verified via a
 * top-level `verified` field, REST `meta.verified`, or ACF `acf.verified`.
 * Missing / falsy → false (badge hidden).
 */
export function isAuthorVerified(author: WPAuthor | null | undefined): boolean {
  if (!author) return false;
  const truthy = (v: unknown) => v === true || v === 1 || v === "1" || v === "true" || v === "yes";
  if (truthy((author as any).verified)) return true;
  if (truthy(author.meta?.["verified"])) return true;
  if (truthy(author.acf?.["verified"])) return true;
  return false;
}

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    author?: WPAuthor[];
    "wp:term"?: WPTerm[][];
  };
}

async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`WP ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

const categoryIdCache = new Map<string, number>();

export async function getCategoryId(slug: string): Promise<number | null> {
  if (categoryIdCache.has(slug)) return categoryIdCache.get(slug)!;
  try {
    const cats = await wpFetch<{ id: number; slug: string }[]>(`/categories?slug=${encodeURIComponent(slug)}`);
    const id = cats[0]?.id ?? null;
    if (id) categoryIdCache.set(slug, id);
    return id;
  } catch {
    return null;
  }
}

export interface FetchPostsOpts {
  categorySlug?: string;
  perPage?: number;
  page?: number;
  search?: string;
  sticky?: boolean;
}

export async function fetchPosts(opts: FetchPostsOpts = {}): Promise<WPPost[]> {
  const params = new URLSearchParams();
  params.set("_embed", "1");
  params.set("per_page", String(opts.perPage ?? 10));
  if (opts.page) params.set("page", String(opts.page));
  if (opts.search) params.set("search", opts.search);
  if (opts.categorySlug) {
    const id = await getCategoryId(opts.categorySlug);
    if (id) params.set("categories", String(id));
  }
  return wpFetch<WPPost[]>(`/posts?${params.toString()}`);
}

export async function fetchPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(`/posts?_embed=1&slug=${encodeURIComponent(slug)}`);
  const post = posts[0] ?? null;
  if (post && typeof window !== "undefined") {
    try { localStorage.setItem(`article:${slug}`, JSON.stringify(post)); } catch {}
  }
  return post;
}

export function readCachedPost(slug: string): WPPost | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`article:${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function featuredImage(post: WPPost, size = "large"): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  const sized = media.media_details?.sizes?.[size]?.source_url;
  return sized ?? media.source_url ?? null;
}

export function postCategory(post: WPPost): WPTerm | null {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  return terms.find((t) => t.taxonomy === "category") ?? null;
}

export function postAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] ?? null;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "\u2019").replace(/&#8216;/g, "\u2018").replace(/&#8220;/g, "\u201C").replace(/&#8221;/g, "\u201D").replace(/&hellip;/g, "\u2026").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

export function estimateReadingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

// JWT auth
const JWT_BASE = "https://mahobainsight.in/wp-json/jwt-auth/v1";

export async function jwtLogin(username: string, password: string) {
  const res = await fetch(`${JWT_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json() as Promise<{ token: string; user_email: string; user_nicename: string; user_display_name: string }>;
}

export async function jwtValidate(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${JWT_BASE}/token/validate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch { return false; }
}

// Author details
export async function fetchAuthor(id: number): Promise<WPAuthor | null> {
  try {
    return await wpFetch<WPAuthor>(`/users/${id}`);
  } catch {
    return null;
  }
}

export async function fetchPostsByAuthor(id: number, page = 1, perPage = 10): Promise<WPPost[]> {
  const params = new URLSearchParams();
  params.set("_embed", "1");
  params.set("author", String(id));
  params.set("per_page", String(perPage));
  params.set("page", String(page));
  return wpFetch<WPPost[]>(`/posts?${params.toString()}`);
}