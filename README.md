# top4

Top 4: pick your favorites and make ranked lists, then share your profile.
We start with LEGO sets (data from [Rebrickable](https://rebrickable.com/downloads/) CSV downloads).

## Tech stack

- [Astro](https://docs.astro.build): pages and server code
- [Svelte](https://svelte.dev): interactive components (coming in step 2)
- [Better Auth](https://www.better-auth.com): email + password accounts (coming later)
- [Cloudflare Workers + D1](https://developers.cloudflare.com/workers/): hosting and database (coming later)

## Run it locally

You need [Node.js](https://nodejs.org) installed.

```sh
npm install       # install the libraries listed in package.json
npm run dev       # start the dev server at http://localhost:4321
npm run check     # type check .astro and .svelte files (also runs on every PR)
npm run build     # build the Worker into dist/
npm run preview   # run the built site in Cloudflare's local runtime (workerd)
```

## Deploy

Live site: https://top4.top4.workers.dev

**Automatic:** every merge into `main` runs `.github/workflows/deploy.yml`, which type checks,
builds and deploys. You can also re-run it by hand: GitHub → Actions → Deploy → "Run workflow".

It uses two GitHub Actions secrets (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN`: custom Cloudflare token with Workers Scripts: Edit, D1: Edit,
  Account Settings: Read, limited to this account
- `CLOUDFLARE_ACCOUNT_ID`

**Manual (rarely needed):**

```sh
npx wrangler login   # once per computer: lets Wrangler use your Cloudflare account
npm run deploy       # build, then upload to Cloudflare
```

## Working rules

- Never commit to `main`. Every change goes on its own branch and pull request.
- Never commit secrets. Secret files (`.dev.vars`, `.env*`) are listed in `.gitignore`.
