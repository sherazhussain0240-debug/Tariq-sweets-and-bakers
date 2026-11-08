import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'tsb_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey && !envUrl.includes('YOUR_SUPABASE') && !envKey.includes('YOUR_SUPABASE')) {
    return { url: envUrl, anonKey: envKey };
  }

  return null;
}

export function saveStoredSupabaseConfig(config: SupabaseConfig | null) {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY);
    activeClient = null;
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  activeClient = null; // Re-instantiate on next call
}

let activeClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (activeClient) return activeClient;
  const config = getStoredSupabaseConfig();
  if (config?.url && config?.anonKey) {
    try {
      activeClient = createClient(config.url, config.anonKey);
      return activeClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return !!getStoredSupabaseConfig();
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, anonKey);
    // Simple light query to verify connectivity
    const { error } = await client.from('categories').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet, but connection succeeded if error is 42P01 (relation does not exist)
      if (error.message && error.message.includes('relation "public.categories" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! The tables are not created yet. Run the SQL schema script in your Supabase SQL Editor.',
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: errorMsg || 'Failed to connect to Supabase.' };
  }
}
