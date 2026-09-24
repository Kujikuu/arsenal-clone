import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { LegalDocument, UserProfile } from '@/types/database';

export type ProfilePatch = Partial<
  Pick<
    UserProfile,
    'full_name' | 'phone' | 'date_of_birth' | 'country' | 'postcode' | 'marketing_opt_in'
  >
>;

export async function updateProfile(userId: string, patch: ProfilePatch) {
  const { error } = await supabase.from('user_profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

export function useLegalDocument(slug: string | undefined) {
  return useQuery(
    ['legal', slug],
    async () =>
      unwrap(
        await supabase.from('legal_documents').select('*').eq('slug', slug).maybeSingle()
      ) as LegalDocument | null,
    { enabled: Boolean(slug) }
  );
}

export interface SupportMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export async function sendSupportMessage(message: SupportMessage, userId?: string) {
  const { error } = await supabase
    .from('support_messages')
    .insert({ ...message, user_id: userId ?? null });
  if (error) throw error;
}
