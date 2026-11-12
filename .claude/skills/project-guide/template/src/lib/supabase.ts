import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null when the keys are not set: the guide then saves everything in this browser only.
// keepalive lets the final timer save finish while the page is closing.
export const supabase =
  url && key
    ? createClient(url, key, { global: { fetch: (input, init) => fetch(input, { ...init, keepalive: true }) } })
    : null;
