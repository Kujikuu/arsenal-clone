import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

/**
 * Deep link Supabase sends users back to from auth emails, e.g.
 * `arsenal-clone://auth/reset-password`. Add `arsenal-clone://**` to the
 * project's Auth → URL Configuration → Redirect URLs.
 */
export function authRedirectUrl(path: 'auth/callback' | 'auth/reset-password'): string {
  return Linking.createURL(path);
}

/** Tokens arrive in the URL fragment (implicit flow) or as `?code=` (PKCE). */
function readParams(url: string): URLSearchParams {
  const params = new URLSearchParams();
  const [beforeHash, hash = ''] = url.split('#');
  const query = beforeHash.split('?')[1] ?? '';
  for (const part of [query, hash]) new URLSearchParams(part).forEach((v, k) => params.set(k, v));
  return params;
}

/**
 * Sign the user in from an auth email link. Returns false when the URL carries
 * no auth data (e.g. the screen was opened directly) and throws when the link
 * is invalid or expired.
 */
export async function setSessionFromUrl(url: string): Promise<boolean> {
  const params = readParams(url);
  const errorMessage = params.get('error_description') ?? params.get('error');
  if (errorMessage) throw new Error(errorMessage.replace(/\+/g, ' '));

  const code = params.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return true;
  }

  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (!access_token || !refresh_token) return false;
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return true;
}
