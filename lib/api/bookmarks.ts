import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import { useAuth } from '@/lib/auth/AuthProvider';

type Target = { articleId: string } | { videoId: string };

function column(target: Target) {
  return 'articleId' in target
    ? { article_id: target.articleId }
    : { video_id: (target as { videoId: string }).videoId };
}

/** Saved state of one article or video for the signed-in user. */
export function useBookmark(target: Target) {
  const router = useRouter();
  const { user } = useAuth();
  const match = column(target);
  const [col, value] = Object.entries(match)[0];

  const query = useQuery(
    ['bookmark', col, value, user?.id],
    async () =>
      Boolean(
        unwrap(
          await supabase
            .from('user_bookmarks')
            .select('id')
            .eq('user_id', user!.id)
            .eq(col, value)
            .maybeSingle()
        )
      ),
    { enabled: Boolean(user && value), initialData: false }
  );

  const toggle = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    const saved = Boolean(query.data);
    query.setData(!saved);
    const { error } = saved
      ? await supabase.from('user_bookmarks').delete().eq('user_id', user.id).eq(col, value)
      : await supabase.from('user_bookmarks').insert({ user_id: user.id, ...match });
    if (error) {
      console.warn('[bookmark] toggle failed:', error.message);
      query.setData(saved);
    }
  };

  return { saved: Boolean(query.data), toggle };
}
