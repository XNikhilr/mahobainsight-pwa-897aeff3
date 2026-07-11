# Deploying to Netlify

This project supports Netlify deployment via TanStack Start's Nitro adapter.

## Quick Deploy

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Netlify auto-detects `netlify.toml`. Confirm:
   - **Build command:** `DEPLOY_TARGET=netlify bun run build`
   - **Publish directory:** `dist/client`
   - **Node version:** 20
4. Deploy. Nitro's `netlify` preset produces the SSR function and static assets automatically.

## Environment variables

Set any required secrets in **Netlify → Site settings → Environment variables**
(e.g. `LOVABLE_API_KEY`, connector keys). Do NOT prefix server secrets with `VITE_`.

## CLI deploy

```bash
DEPLOY_TARGET=netlify bun run build
npx netlify deploy --prod --dir=dist/client
```

## Switching back to Cloudflare Workers

Leave `DEPLOY_TARGET` unset (the Lovable default). No config changes needed.

## Edge functions instead of serverless

Set `DEPLOY_TARGET=netlify-edge` to use Netlify Edge Functions.
