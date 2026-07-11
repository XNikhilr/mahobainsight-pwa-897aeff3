import { useEffect, useState, useCallback } from "react";

const KEY = "bookmarks:v1";

function read(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(ids: number[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
  window.dispatchEvent(new Event("bookmarks-change"));
}

export function useBookmark(id: number) {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    setIds(read());
    const h = () => setIds(read());
    window.addEventListener("bookmarks-change", h);
    return () => window.removeEventListener("bookmarks-change", h);
  }, []);
  const on = ids.includes(id);
  const toggle = useCallback(() => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(next);
  }, [id]);
  return { on, toggle };
}

export function useBookmarks() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    setIds(read());
    const h = () => setIds(read());
    window.addEventListener("bookmarks-change", h);
    return () => window.removeEventListener("bookmarks-change", h);
  }, []);
  return ids;
}