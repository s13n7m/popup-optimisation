import type { Constraints, Plan } from './types';
import { mockPlan } from './mock';

const BASE = import.meta.env.VITE_API_URL as string | undefined;

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`The planner service answered ${res.status}. Try again in a moment.`);
  return res.json() as Promise<T>;
}

// Uses mock data until VITE_API_URL is set.
export async function replan(market: string, constraints: Constraints): Promise<Plan> {
  if (!BASE) {
    await new Promise((r) => setTimeout(r, 400));
    return mockPlan(market, constraints);
  }
  await post('/constraints', constraints);
  return post<Plan>(`/replan/${encodeURIComponent(market)}`, {});
}
