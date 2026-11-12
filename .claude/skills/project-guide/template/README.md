# Project build guide

An interactive guide for building this project: stages with collapsible action cards, a work timer, a reference tab, and a build order. Progress and timer sessions sync through Supabase.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

- Edit `src/config.ts` for the title, labels and storage key, and `src/content/` for the stages.
- In Supabase, run `supabase/progress.sql` and `supabase/work_sessions.sql`, add the anon key to `.env` (see `.env.example`), add `{{ .Token }}` to the Magic Link email template so the email carries a sign-in code, sign in with the code, then turn off new sign-ups.
- Deploy on Vercel with the root directory set to the folder that holds this guide.
