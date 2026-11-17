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
npm install     # install the libraries listed in package.json
npm run dev     # start the dev server at http://localhost:4321
```

## Working rules

- Never commit to `main`. Every change goes on its own branch and pull request.
- Never commit secrets. Secret files (`.dev.vars`, `.env*`) are listed in `.gitignore`.
