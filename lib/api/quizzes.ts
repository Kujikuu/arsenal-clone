import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { ContentTeamType, Quiz, QuizQuestion } from '@/types/database';

export function useQuizzes(teamType: ContentTeamType | null = null) {
  return useQuery(
    ['quizzes', teamType],
    async () => {
      let query = supabase.from('quizzes').select('*').order('published_at', { ascending: false });
      if (teamType) query = query.eq('team_type', teamType);
      return unwrap(await query) as Quiz[];
    },
    { initialData: [] }
  );
}

export interface QuizDetail {
  quiz: Quiz | null;
  questions: QuizQuestion[];
  /** Best score from a previous attempt by the signed-in user. */
  bestScore: number | null;
}

export function useQuiz(id: string | undefined, userId: string | undefined) {
  return useQuery(
    ['quiz', id, userId],
    async (): Promise<QuizDetail> => {
      const [quiz, questions, attempts] = await Promise.all([
        supabase.from('quizzes').select('*').eq('id', id).maybeSingle(),
        supabase.from('quiz_questions').select('*').eq('quiz_id', id).order('sort'),
        userId
          ? supabase
              .from('quiz_attempts')
              .select('score')
              .eq('quiz_id', id)
              .eq('user_id', userId)
              .order('score', { ascending: false })
              .limit(1)
          : Promise.resolve({ data: [], error: null }),
      ]);
      const best = (unwrap(attempts) as { score: number }[])[0];
      return {
        quiz: unwrap(quiz) as Quiz | null,
        questions: unwrap(questions) as QuizQuestion[],
        bestScore: best ? best.score : null,
      };
    },
    { enabled: Boolean(id) }
  );
}

export async function saveQuizAttempt(
  quizId: string,
  userId: string,
  score: number,
  total: number
) {
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({ quiz_id: quizId, user_id: userId, score, total });
  if (error) throw error;
}
