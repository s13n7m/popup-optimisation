# Pop-up build guide

An interactive guide for building the predict-then-decide planner. It lists every stage, with action cards you can open for steps, a "done when" check and the files to touch, a data sources how-to for stage 2, and a build order. It is a development companion for you. The planner product for non-technical users is `app/`.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Work timer

Press Work to start the clock. It shows time worked today, pauses on Pause or when the tab is hidden or closed, and continues when you press Work again. Sessions are cached on the device and saved to the `work_sessions` table while you are signed in.

## Reusing this guide

Project wording lives in `src/config.ts` and the stages in `src/content/`. The skill in `.claude/skills/project-guide/` explains how to build a guide like this for another project.

## Content

Each stage is one file in `src/content/`. Add or edit cards there, keeping each card `id` stable because progress is saved by id.

## Saving progress

Without Supabase the guide saves ticks in the browser only. To sync across browsers:

1. Create a Supabase project and run `supabase/progress.sql` (ticks) and then `supabase/work_sessions.sql` (work timer) in the SQL editor.
2. Copy `.env.example` to `.env` and fill in the project URL and the anon key. Use the anon key only.
3. In Authentication, add your Vercel URLs as redirect URLs, sign in once with an email link, then turn off new sign-ups.
4. Set the same two variables in Vercel.

## Deploy

Create a Vercel project from this repo with the root directory set to `guide`. Each pushed branch gets a preview URL.
