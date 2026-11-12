# Pop-up Planner app

The planner-facing frontend: a Vite, React and TypeScript app for non-technical users to read recommendations, try what-ifs, see why a venue was picked, and compare plans. It talks to the FastAPI service from step 6 and uses built-in mock data until that exists.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build
```

Copy `.env.example` to `.env` and set `VITE_API_URL` once the API is running. The API contract is in `src/api/types.ts`.

Deploy as its own Vercel project with the root directory set to `app`.

Screens are placeholders. The build plan for each is in the roadmap guide in `guide/`, under the "Planner UI" cards.
