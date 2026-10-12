# Copper Room website (copperroom.studio)

Plain hand-written HTML/CSS/JS served as-is by GitHub Pages. No generator, no build step. `package.json` exists only for the Playwright dev dependency used in checks; the site itself uses nothing from it.
The publishing branch is `main` (confirm under GitHub → Settings → Pages if in doubt).

## Rules

### Publishing
- Every push to `main` goes live on copperroom.studio. Before any push (to any branch), show the user which files changed and what changed in each, then wait for an explicit OK.

### Custom domain
- Never delete, rename or edit `CNAME`, or anything else that controls the custom domain (the GitHub Pages domain settings, DNS-related files).

### Generated and user-managed folders
- `copperlight/` is generated from the separate copperlight repo (`../copperlight`, via `tools/build-site.mjs`). Never hand-edit anything in it here. Changes belong in the copperlight repo, then get rebuilt.
- `shots/` holds screenshots the user manages. Never remove or rename anything there unless the user asks.

### Session start
- Run `git pull`. If it fails, or `git status` shows uncommitted changes, stop and tell the user before doing anything else.

### After making changes
- Start a local preview server from the repo root (e.g. `python3 -m http.server 8000`).
- Open every changed page in headless Chromium (Playwright, a pinned dev dependency here; run `npm install` if `node_modules/` is missing) and check for broken links/images (local 404s) and console errors. Report the results, then stop the server.
- The Chromium build is shared with the copperlight repo in `~/Library/Caches/ms-playwright`, so never run `npx playwright install` here. Keep the `playwright` version in `package.json` matched to copperlight's, so both use the same browser build.

### Talking to the user
- The user is new to Terminal and git. For every action that needs their approval (commit, push, pull, deleting files, etc.), explain it in one plain sentence first.
