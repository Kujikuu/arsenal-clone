import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { useMatchPrediction } from '@/lib/api/predictions';
import { useSquad } from '@/lib/api/squad';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useNow } from '@/lib/useNow';
import type { Match } from '@/types/database';
import { PALETTE } from '@/theme/palette';

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View className="flex-1 items-center">
      <Text className="font-body-semibold text-white" style={{ fontSize: 14 }} numberOfLines={1}>
        {label}
      </Text>
      <View className="flex-row items-center" style={{ marginTop: 12 }}>
        <Pressable
          onPress={() => onChange(Math.max(0, value - 1))}
          accessibilityLabel={`Fewer goals for ${label}`}
          hitSlop={6}
          style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: PALETTE.chip }}
          className="items-center justify-center active:opacity-70">
          <Feather name="minus" size={18} color="#FFF" />
        </Pressable>
        <View style={{ width: 52 }} className="items-center">
          <DisplayText size={26}>{value}</DisplayText>
        </View>
        <Pressable
          onPress={() => onChange(Math.min(15, value + 1))}
          accessibilityLabel={`More goals for ${label}`}
          hitSlop={6}
          style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: PALETTE.chip }}
          className="items-center justify-center active:opacity-70">
          <Feather name="plus" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

/** Score predictor shown before kick-off. */
export function PredictionCard({ match }: { match: Match }) {
  const router = useRouter();
  const { user } = useAuth();
  const prediction = useMatchPrediction(match.id, user?.id);
  const squad = useSquad(match.team_type);
  const [home, setHome] = useState(1);
  const [away, setAway] = useState(1);
  const [scorer, setScorer] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const saved = prediction.data;
  useEffect(() => {
    if (!saved) return;
    setHome(saved.home_score_pred);
    setAway(saved.away_score_pred);
    setScorer(saved.first_scorer_pred);
  }, [saved]);

  const now = useNow();
  const locked = new Date(match.match_date).getTime() <= now;
  const scorers = (squad.data ?? []).filter((p) => p.position !== 'Goalkeeper');

  const submit = async () => {
    if (!scorer) {
      Alert.alert('Pick a first scorer', 'Choose who you think will score first.');
      return;
    }
    setSaving(true);
    try {
      await prediction.submit(home, away, scorer);
      setEditing(false);
    } catch (error: any) {
      Alert.alert('Could not save prediction', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const showForm = !saved || editing;

  return (
    <View
      style={{ backgroundColor: PALETTE.surface, borderRadius: 8, padding: 16, marginBottom: 17 }}>
      <DisplayText size={13}>PREDICT THE SCORE</DisplayText>
      {!user ? (
        <>
          <Text
            className="font-body text-white"
            style={{ fontSize: 15, lineHeight: 20, marginTop: 10 }}>
            Sign in to predict the score and first goalscorer.
          </Text>
          <PillButton
            label="SIGN IN"
            height={36}
            onPress={() => router.push('/auth/login')}
            style={{ marginTop: 14, alignSelf: 'flex-start' }}
          />
        </>
      ) : !showForm && saved ? (
        <>
          <Text className="font-body text-white" style={{ fontSize: 15, marginTop: 12 }}>
            Your prediction
          </Text>
          <DisplayText size={22} style={{ marginTop: 8 }}>
            {`${saved.home_score_pred} - ${saved.away_score_pred}`}
          </DisplayText>
          <Text
            className="font-body"
            style={{ fontSize: 14, color: PALETTE.textMuted, marginTop: 6 }}>
            First scorer: {saved.first_scorer_pred}
          </Text>
          {!locked && (
            <PillButton
              label="EDIT PREDICTION"
              variant="secondary"
              height={34}
              onPress={() => setEditing(true)}
              style={{ marginTop: 14, alignSelf: 'flex-start' }}
            />
          )}
        </>
      ) : locked ? (
        <Text className="font-body text-white" style={{ fontSize: 15, marginTop: 10 }}>
          Predictions closed at kick-off.
        </Text>
      ) : (
        <>
          <View className="flex-row" style={{ marginTop: 18 }}>
            <Stepper label={match.home_team} value={home} onChange={setHome} />
            <Stepper label={match.away_team} value={away} onChange={setAway} />
          </View>
          <Text className="font-body-semibold text-white" style={{ fontSize: 14, marginTop: 20 }}>
            First goalscorer
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10, marginHorizontal: -16 }}
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            {scorers.map((p) => {
              const name = p.known_as ?? `${p.first_name} ${p.last_name}`;
              const selected = scorer === name;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setScorer(name)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={{
                    height: 32,
                    borderRadius: 16,
                    paddingHorizontal: 14,
                    marginRight: 8,
                    backgroundColor: selected ? PALETTE.red : PALETTE.chip,
                  }}
                  className="items-center justify-center">
                  <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <PillButton
            label={saved ? 'UPDATE PREDICTION' : 'SUBMIT PREDICTION'}
            height={40}
            loading={saving}
            onPress={submit}
            style={{ marginTop: 18 }}
          />
        </>
      )}
    </View>
  );
}
