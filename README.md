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

```sh
npx wrangler login   # once per computer: lets Wrangler use your Cloudflare account
npm run deploy       # build, then upload to Cloudflare
```

Deploys will move to GitHub Actions (automatic after merging to `main`) in a later step.

## Working rules

- Never commit to `main`. Every change goes on its own branch and pull request.
- Never commit secrets. Secret files (`.dev.vars`, `.env*`) are listed in `.gitignore`.
