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

## First-time local setup

```sh
cp .dev.vars.example .dev.vars   # then put a random value in BETTER_AUTH_SECRET
npm run db:migrate:local         # create the tables in your local database
```

## Accounts (Better Auth)

- Email + password sign-up and log-in. Settings in `src/lib/auth-options.ts`, setup in `src/lib/auth.ts`.
- Pages: `/signup` and `/login` (Svelte forms in `src/components/`), and `/me` (protected account page).
- `src/middleware.ts` runs before every request and puts the logged-in user in `Astro.locals.user`
  (or `null`). Pages use it to show personal content or redirect:

  ```astro
  ---
  const { user } = Astro.locals;
  if (!user) return Astro.redirect('/login'); // protect a page
  ---
  ```

- Svelte components use the browser client in `src/lib/auth-client.ts`, never `auth.ts` (server only).
- Pages are rendered on the server per request (`output: 'server'` in `astro.config.mjs`).
- All auth requests go to `/api/auth/*` (for example `POST /api/auth/sign-up/email`).
- Passwords are stored hashed (scrypt), never in plain text.
- If you change auth settings or add a Better Auth plugin:
  `npm run auth:generate` (updates `src/db/auth-schema.ts`), then `npm run db:generate`.

Secrets and settings:

| Name | Local | Production |
|---|---|---|
| `BETTER_AUTH_SECRET` | `.dev.vars` (never committed) | Cloudflare secret: `npx wrangler secret put BETTER_AUTH_SECRET` |
| `BETTER_AUTH_URL` | `.dev.vars` | `vars` in `wrangler.jsonc` |

## Database (Cloudflare D1 + Drizzle)

- D1 database `top4-db`, available in server code as `env.DB` (see `wrangler.jsonc`)
- Tables are defined in `src/db/schema.ts`. Use `getDb()` from `src/db/index.ts` to query.
- `GET /api/health` returns `{ ok, database, tables }` to check the Worker can reach D1.

Changing tables:

```sh
npm run db:generate         # 1. create a migration (.sql) in migrations/ from schema.ts
npm run db:migrate:local    # 2. apply it to your local database (.wrangler/)
npm run db:migrate:remote   # 3. apply it to the real database on Cloudflare
```

## Deploy

Live site: https://top4.top4.workers.dev

**Automatic:** every merge into `main` runs `.github/workflows/deploy.yml`, which type checks,
applies new database migrations to the real D1 database, then builds and deploys. You can also re-run it by hand: GitHub → Actions → Deploy → "Run workflow".

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

The full rules for people and coding agents are in [`AGENTS.md`](AGENTS.md)
(Claude Code reads them through [`CLAUDE.md`](CLAUDE.md)). In short:

- Never commit to `main`. Every change goes on its own branch and pull request.
- Never commit secrets. Secret files (`.dev.vars`, `.env*`) are listed in `.gitignore`.
