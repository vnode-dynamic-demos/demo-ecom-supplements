import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function isValidUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Returns a Supabase client if credentials are configured, otherwise null.
 * Use `isSupabaseConfigured()` from lib/products.ts before calling this.
 */
export function getSupabaseClient(): SupabaseClient | null {
    if (_client) return _client;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!isValidUrl(url) || !key || key === 'YOUR_SUPABASE_ANON_KEY') {
        return null;
    }

    _client = createClient(url!, key);
    return _client;
}

// Convenience re-export (may be null in demo mode)
export const supabase = getSupabaseClient();
