---
description: Show what changed, wait for my OK, then commit and push
---

Wrap up the current work: show me what changed, wait for my explicit OK, then commit and push.

The project rules in `.claude/CLAUDE.md` apply throughout. I'm new to Terminal and git, so keep explanations plain.

## 1. Look at what changed

- Run `git status` and `git diff` (plus `git diff --staged`, and read any untracked files) to see every change.
- If nothing changed, say so and stop.
- Find out which branch we're on and whether it tracks a remote branch.

## 2. Show me the changes

List every changed file with one or two plain sentences on what changed in it (added, edited, deleted, and what that means for the site). Then:

- Say which branch this will push to. If it's `main`, say clearly that pushing puts these changes live on copperroom.studio.
- Flag, and leave out of the commit unless I explicitly say otherwise:
  - any change to `CNAME` or anything else that controls the custom domain,
  - any hand edit inside `copperlight/` (it's generated from the copperlight repo),
  - any file removed or renamed inside `shots/`,
  - anything that looks like a secret, key, password, or a stray/junk file (e.g. `.DS_Store`, `node_modules/`).
- If pages changed and the local preview check from CLAUDE.md (headless Chromium for broken links/images and console errors) hasn't been run this session, say so and offer to run it first.
- Propose a short commit message in the style of recent commits (`git log --oneline -10`), ending with the attribution line from the session's instructions.

Explain in one plain sentence what committing does and what pushing does, then ask for my OK. **Stop and wait.** Don't commit or push until I reply with a clear yes. If I ask for changes (different message, leave a file out, etc.), make them and ask again.

## 3. Commit and push (only after my OK)

- Stage only the files I approved, by name (no `git add -A` / `git add .`).
- Commit with the approved message.
- Push to the current branch's remote. Never force-push.
- If the push is rejected because the remote has newer commits, stop and explain what happened in plain words. Don't pull, merge, or rebase without asking.

## 4. Report

Tell me the commit's short hash, what got pushed and where, and (if it was `main`) that GitHub Pages usually updates copperroom.studio within a minute or two.
