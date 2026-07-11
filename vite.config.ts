// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Deployment target — override with DEPLOY_TARGET=netlify (or netlify-edge) at build time.
// Defaults to Lovable's Cloudflare Workers preset when unset.
const deployTarget = process.env.DEPLOY_TARGET;
const nitroConfig =
  deployTarget === "netlify" || deployTarget === "netlify-edge"
    ? { preset: deployTarget }
    : undefined;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  ...(nitroConfig ? { nitro: nitroConfig } : {}),
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        devOptions: { enabled: false },
        filename: "sw.js",
        manifest: false,
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/api/, /^\/~oauth/],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.hostname.endsWith("mahobainsight.in") && url.pathname.startsWith("/wp-json/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "wp-api",
                networkTimeoutSeconds: 6,
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 7 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.hostname.endsWith("mahobainsight.in") &&
                /\.(png|jpe?g|webp|gif|svg)$/i.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "wp-images",
                expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) => url.hostname === "fonts.gstatic.com",
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "pages",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 60 },
              },
            },
          ],
        },
      }),
    ],
  },
});
