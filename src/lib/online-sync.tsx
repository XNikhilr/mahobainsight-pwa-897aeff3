import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * When the browser comes back online, silently refetch active queries
 * (breaking news, feeds, article lists) without blocking the UI.
 * React Query already dedupes and keeps stale data on screen while it revalidates.
 */
export function OnlineSync() {
  const qc = useQueryClient();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = () => {
      // Refresh anything currently on screen.
      qc.invalidateQueries({ refetchType: "active" });
    };
    const onFocus = () => {
      // Cheap, targeted freshness on tab focus for the live ticker + home feed.
      qc.invalidateQueries({ queryKey: ["ticker"], refetchType: "active" });
      qc.invalidateQueries({ queryKey: ["home-feed"], refetchType: "active" });
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
    };
  }, [qc]);
  return null;
}