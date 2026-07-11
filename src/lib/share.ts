import { stripHtml, type WPPost } from "./wp";

export function buildShareSummary(post: WPPost): string {
  const raw = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : stripHtml(post.content?.rendered ?? "");
  const firstSentence = raw.split(/(?<=[.!?])\s/)[0] ?? raw;
  const words = firstSentence.split(/\s+/).filter(Boolean).slice(0, 16);
  let out = words.join(" ");
  if (out && !/[.!?]$/.test(out)) out += ".";
  return out;
}

export function buildShareText(post: WPPost): string {
  const title = stripHtml(post.title.rendered);
  const summary = buildShareSummary(post);
  return `${title}\n\n${summary}\n\nRead more:\n${post.link}`;
}

export async function sharePost(post: WPPost): Promise<boolean> {
  const text = buildShareText(post);
  const title = stripHtml(post.title.rendered);
  if (typeof navigator !== "undefined" && (navigator as any).share) {
    try {
      await (navigator as any).share({ title, text, url: post.link });
      return true;
    } catch { /* cancelled */ }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  return false;
}