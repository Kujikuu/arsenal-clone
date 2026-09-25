import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { saveQuizAttempt, useQuiz } from '@/lib/api/quizzes';
import { useAuth } from '@/lib/auth/AuthProvider';
import { resolveImage } from '@/lib/media/resolveImage';
import { PALETTE } from '@/theme/palette';

type Phase = 'intro' | 'question' | 'result';

/** Multiple-choice quiz with instant feedback; scores are saved for signed-in fans. */
export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuiz(id, user?.id);
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'failed'>('idle');

  if (!data?.quiz) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="back" />
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState icon="help-circle-outline" title="Quiz not found" />
        )}
      </View>
    );
  }

  const { quiz, questions, bestScore } = data;
  const question = questions[index];
  const total = questions.length;

  const start = () => {
    setIndex(0);
    setScore(0);
    setPicked(null);
    setSaveState('idle');
    setPhase('question');
  };

  const pick = (option: number) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.correct_index) setScore((s) => s + 1);
  };

  const next = async () => {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setPicked(null);
      return;
    }
    setPhase('result');
    if (user) {
      try {
        await saveQuizAttempt(quiz.id, user.id, score, total);
        setSaveState('saved');
        refetch();
      } catch {
        setSaveState('failed');
      }
    }
  };

  return (
    <View className="flex-1 bg-black">
      <AppHeader left="back" title={<DisplayText size={14}>QUIZ</DisplayText>} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {phase === 'intro' && (
          <>
            <Image
              source={resolveImage(quiz.cover_url)}
              style={{ width: '100%', height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Text className="font-body-semibold text-white" style={{ fontSize: 26, marginTop: 20 }}>
              {quiz.title}
            </Text>
            <Text
              className="font-body"
              style={{ fontSize: 16, color: '#C8C6C7', marginTop: 8, lineHeight: 22 }}>
              {quiz.description}
            </Text>
            <Text
              className="font-body"
              style={{ fontSize: 14, color: PALETTE.textMuted, marginTop: 12 }}>
              {total} questions
              {bestScore !== null ? ` · Your best: ${bestScore}/${total}` : ''}
            </Text>
            <PillButton
              label="START QUIZ"
              onPress={start}
              style={{ marginTop: 28 }}
              disabled={!total}
            />
          </>
        )}

        {phase === 'question' && question && (
          <>
            <DisplayText size={11} color="#C8C6C7" heavy={false}>
              {`QUESTION ${index + 1} OF ${total}`}
            </DisplayText>
            <View
              style={{ height: 4, backgroundColor: PALETTE.track, borderRadius: 2, marginTop: 12 }}>
              <View
                style={{
                  width: `${((index + (picked !== null ? 1 : 0)) / total) * 100}%`,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: PALETTE.red,
                }}
              />
            </View>
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 22, lineHeight: 28, marginTop: 22 }}>
              {question.prompt}
            </Text>
            <View style={{ marginTop: 20 }}>
              {question.options.map((option, i) => {
                const answered = picked !== null;
                const correct = i === question.correct_index;
                const chosen = i === picked;
                const background = !answered
                  ? PALETTE.surfaceRaised
                  : correct
                    ? 'rgba(125,233,134,0.18)'
                    : chosen
                      ? 'rgba(238,79,76,0.2)'
                      : PALETTE.surfaceRaised;
                const border =
                  answered && correct
                    ? PALETTE.formUp
                    : answered && chosen
                      ? PALETTE.formDown
                      : 'transparent';
                return (
                  <Pressable
                    key={i}
                    onPress={() => pick(i)}
                    disabled={answered}
                    accessibilityRole="button"
                    style={{
                      minHeight: 54,
                      borderRadius: 8,
                      marginBottom: 10,
                      paddingHorizontal: 16,
                      backgroundColor: background,
                      borderWidth: 1,
                      borderColor: border,
                    }}
                    className="flex-row items-center active:opacity-80">
                    <Text className="flex-1 font-body-semibold text-white" style={{ fontSize: 16 }}>
                      {option}
                    </Text>
                    {answered && correct && (
                      <Ionicons name="checkmark-circle" size={22} color={PALETTE.formUp} />
                    )}
                    {answered && chosen && !correct && (
                      <Ionicons name="close-circle" size={22} color={PALETTE.formDown} />
                    )}
                  </Pressable>
                );
              })}
            </View>
            {picked !== null && (
              <>
                {question.explanation ? (
                  <Text
                    className="font-body"
                    style={{ fontSize: 15, lineHeight: 21, color: '#C8C6C7', marginTop: 8 }}>
                    {question.explanation}
                  </Text>
                ) : null}
                <PillButton
                  label={index + 1 < total ? 'NEXT QUESTION' : 'SEE RESULT'}
                  onPress={next}
                  style={{ marginTop: 24 }}
                />
              </>
            )}
          </>
        )}

        {phase === 'result' && (
          <View className="items-center" style={{ paddingTop: 40 }}>
            <DisplayText size={13} color="#C8C6C7" heavy={false}>
              YOU SCORED
            </DisplayText>
            <DisplayText size={52} style={{ marginTop: 16 }}>
              {`${score}/${total}`}
            </DisplayText>
            <Text
              className="text-center font-body text-white"
              style={{ fontSize: 17, marginTop: 18 }}>
              {score === total
                ? 'Perfect! A true Gooner.'
                : score >= total / 2
                  ? 'Good effort. Can you get full marks?'
                  : 'Brush up and have another go.'}
            </Text>
            <Text
              className="text-center font-body"
              style={{ fontSize: 14, color: PALETTE.textMuted, marginTop: 10 }}>
              {!user
                ? 'Sign in to save your scores.'
                : saveState === 'saved'
                  ? 'Score saved to your account.'
                  : saveState === 'failed'
                    ? "Your score couldn't be saved."
                    : ''}
            </Text>
            <PillButton
              label="PLAY AGAIN"
              onPress={start}
              style={{ marginTop: 28, alignSelf: 'stretch' }}
            />
            <PillButton
              label="BACK TO MEDIA"
              variant="secondary"
              onPress={() => router.back()}
              style={{ marginTop: 12, alignSelf: 'stretch' }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
