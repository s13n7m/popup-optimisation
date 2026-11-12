import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null when the keys are not set: the guide then saves ticks in this browser only.
export const supabase = url && key ? createClient(url, key) : null;
