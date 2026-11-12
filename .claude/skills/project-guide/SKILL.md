---
name: project-guide
description: Build an interactive, stage-by-stage project guide web app (Vite, React, TypeScript) that a developer follows while building a multi-stage project. Stages are bordered panels of collapsible action cards with tick boxes, a work timer, filters, a reference tab and a build-order view, with progress and time saved to Supabase and deployed on Vercel. Use when the user asks for a build guide, roadmap app, project tracker or "guide like the pop-up one" for a new project, or wants to extend or edit this repo's guide/ folder.
---

# Project guide

A guide is a development companion for the person building a project. It is not the product. It turns a roadmap into stages of small action cards, so the builder always knows what to do next, how to do it and when it is done.

The reference implementation is `guide/` in this repo. `template/` beside this file is a clean copy with example content that you can scaffold from.

## What the guide contains

- **Stages:** bordered panels, one per lifecycle stage, each with a coloured header (stage name, step, branch, output, progress bar) and a stack of cards. Stage 0 is infrastructure set up once.
- **Cards:** a short action, a run-frequency marker, optional tags, a tick box and a collapsible body with numbered steps and a "done when" check.
- **Timer:** a work clock that counts up, pauses on Pause or when the tab is hidden, and saves sessions.
- **Tabs:** Stages, a reference tab (API or source how-tos with copyable examples), and Build order (phases with finish lines).
- **Filters:** run frequency, the cross-cutting thread tag, extras only, hide done. Expand all and collapse all.
- **Layout rules:** square corners everywhere, hard-shadow stage panels. Desktop is side-by-side columns scrolling sideways. Under 768px the stages stack top to bottom and each stage's cards scroll sideways. The timer is a box beside the title on large screens and a floating clock top right on phones.

## Process

### 1. Interview first
Ask the user, in one short round, only what you cannot infer:
- What is being built, and who is the guide for (almost always the builder).
- The stages, in build order. If they have no list, propose one from the lifecycle they care about and let them edit it.
- Any thread that cuts across stages (a frontend, a data pipeline, security) to tag with the thread flag.
- Whether they need a reference tab (sources, APIs, vendors) and which stage it belongs to.
- Hosting and sync: Vercel plus Supabase is the supported path. Ask for the domain name only if they have one.
- Which things already exist (repo, accounts, deployed projects).

### 2. Scaffold
1. Copy `template/` to `guide/` in the target repo. Do not copy `node_modules` or `dist`.
2. Edit `src/config.ts`: title, subtitle, storage key (unique per project), thread label, reference stage id and tab text. Also set the `<title>` in `index.html`.
3. Write `src/content/stage-N-<slug>.ts`, one file per stage, and list them in `src/content/index.ts`. Update `build-order.ts` and, if used, `data-sources.ts`. Remove the reference tab in `src/App.tsx` if the project has no use for it.
4. If the project is not a data or ML pipeline, rename the run-frequency labels in `CADENCE` in `src/types.ts` (the letters O, N, D, M and their meanings) and the legend adapts.
5. `npm install`, then `npm run build`. Fix typecheck errors before anything else.

### 3. Write the content well
Card rules:
- `id` is stable and unique, for example `s3-split`. Progress is saved by id, so never rename an id after the user has ticked it.
- `text` is one action in the imperative, under about 90 characters.
- `steps` has 1 to 5 concrete steps the person can follow without guessing. Name the exact file, command, setting or menu.
- `done` is one checkable sentence, so the person can tell the card is finished.
- `extra: true` marks good practice that the original plan did not list. Use it honestly.
- `ui: true` marks the cross-cutting thread tag. Rename it with `threadLabel`.
- Aim for 4 to 13 cards per stage. If a stage needs more, split it.

Stage rules:
- Give each stage a branch name. Work on one branch per stage, each started from `main` after the last is merged.
- `out` says what the stage hands to the next one. `files` lists the commands and files, shown on the yellow note.
- Spread cross-cutting work across the stages where it really belongs, and tag it, so one filter shows the whole thread.
- Stage 0 holds one-off setup: tooling, hosting, database, accounts and keys, CI, secrets.

Writing rules: plain, specific sentences. No marketing language. State uncertainty. For any outside API or source, say the content was written from memory and link the docs.

### 4. Supabase (progress and timer)
The guide works without Supabase, saving in the browser only. To sync, the user must do these steps. You cannot do them for them:
1. Create a Supabase project and run `supabase/progress.sql`, then `supabase/work_sessions.sql`, in the SQL editor.
2. Authentication: keep Email on. Add the production URL and the preview URL pattern as redirect URLs.
3. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a local `.env` and in the Vercel project's environment variables, then redeploy. Use only the anon key. Never put a service-role key in a browser app.
4. Sign in once with an email link, then turn off new sign-ups so only that account exists.

Row level security limits every row to its owner. Do not weaken the policies.

### 5. Vercel
- One project per app. Root directory is the folder that holds the app, preset Vite.
- The production branch is `main`. Each branch gets a preview URL, which is how the user approves changes visually.
- A domain can be attached under Settings, Domains. Deployment Protection controls whether visitors must sign in to Vercel.

### 6. Verify before saying it is done
- `npm run build` passes.
- Look once at about 1500px and 390px wide. Check there is no sideways page scroll at 390px, the timer is visible, stages are clearly separated, and a card expands.
- State plainly what you did not test, for example the Supabase sign-in when no keys exist.

## Keeping the template current
When `guide/` in this repo gains a feature, run `bash .claude/skills/project-guide/scripts/sync-template.sh` from the repo root. It copies the app code into `template/` and leaves the template's own example content, config and README alone. Build the template once afterwards.

## Using the skill in another project
This skill lives in the repo at `.claude/skills/project-guide/`. To use it elsewhere, copy the whole folder to `~/.claude/skills/project-guide/` for all projects on a machine, or into the other repo's `.claude/skills/`.

## Do not
- Do not add rounded corners, shadows other than the hard offset ones, or new colours outside the phase and run-frequency palettes without asking.
- Do not store secrets in the guide or its content.
- Do not rename card ids that already have progress.
- Do not turn the guide into the product. Keep it a checklist and a reference.
