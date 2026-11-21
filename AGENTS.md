# Agent instructions for top4

These instructions are for every coding agent (Claude Code, Codex, and others) and every
person working in this repo. `CLAUDE.md` imports this file, so Claude Code reads the same rules.

## Workflow rules

These rules always apply. If a rule blocks you, stop and ask the human; don't work around it.

1. **Never commit or push directly to `main`.** GitHub branch protection also blocks this.
2. **Every change goes on its own branch with a pull request.**
   - Start from an up-to-date `main`: `git switch main`, `git pull`, `git switch -c <short-descriptive-name>`.
   - Keep each branch small and focused on one change.
   - Push the branch (`git push -u origin <branch>`) and open a pull request into `main`.
3. **Wait for checks to pass.** Every PR runs the "Type check and build" check
   (`.github/workflows/checks.yml`). A PR is only ready when it is green. If it fails, fix it
   on the same branch. Run `npm run check` and `npm run build` locally before pushing.
4. **Never merge pull requests yourself.** The human reviews and merges every PR. When the PR
   is open, share the link and stop.
5. **Never put secrets in the code.** No passwords, API tokens, or keys in any committed file,
   commit message, or PR description.
   - Local secrets go in `.dev.vars` (git-ignored; copy `.dev.vars.example`).
   - Production secrets are Cloudflare secrets (`npx wrangler secret put <NAME>`).
   - CI secrets are GitHub Actions secrets.
   - This repo is public: anything committed can be seen by anyone, forever.
6. **Never rewrite shared history.** No force-pushing to `main` and no deleting `main`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
