import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DisplayText } from '@/components/ui/DisplayText';
import { LoadingState } from '@/components/ui/States';
import { useFixtureOptions } from '@/lib/api/matches';
import {
  ALL_COMPETITIONS,
  DEFAULT_FILTER,
  useFilterStore,
  type FixtureFilter,
  type TeamSelection,
} from '@/store/filterStore';
import type { TeamType } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const TEAMS: TeamSelection[] = ['Arsenal', 'All'];
const TEAM_LABEL: Record<TeamType, string> = { men: "Men's", women: "Women's", academy: 'Academy' };

type SectionKey = 'teams' | 'competitions' | 'season';

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C9C9C9',
        backgroundColor: '#F7F7F7',
      }}
      className="items-center justify-center">
      {selected && (
        <View style={{ width: 19, height: 19, borderRadius: 10, backgroundColor: '#000' }} />
      )}
    </View>
  );
}

interface OptionRowProps {
  label: string;
  selected: boolean;
  muted?: boolean;
  onPress: () => void;
}

function OptionRow({ label, selected, muted = false, onPress }: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{ height: 42 }}
      className="flex-row items-center active:opacity-70">
      <Radio selected={selected} />
      <Text
        className="font-body"
        style={{ fontSize: 16.5, marginLeft: 18, color: muted && !selected ? '#B5B5B5' : '#222' }}>
        {label}
      </Text>
    </Pressable>
  );
}

interface SectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, open, onToggle, children }: SectionProps) {
  return (
    <View
      style={{ borderBottomWidth: 1, borderBottomColor: '#DCDCDC', paddingBottom: open ? 24 : 18 }}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{ paddingTop: 18, paddingBottom: open ? 8 : 0 }}
        className="flex-row items-center justify-between">
        <DisplayText size={18.5} color="#000">
          {title}
        </DisplayText>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={26} color="#000" />
      </Pressable>
      {open && children}
    </View>
  );
}

/** Fixture filters sheet (ref/match-fixtures-filter.jpeg). */
export default function FilterFixturesModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ team?: string }>();
  const teamType: TeamType =
    params.team === 'women' || params.team === 'academy' ? params.team : 'men';

  const stored = useFilterStore((s) => s.filters[teamType]);
  const setFilter = useFilterStore((s) => s.setFilter);
  const options = useFixtureOptions(teamType);

  const [draft, setDraft] = useState<FixtureFilter>(stored);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    teams: true,
    competitions: true,
    season: false,
  });

  const competitions = [ALL_COMPETITIONS, ...(options.data?.competitions ?? [])];
  const seasons = options.data?.seasons ?? [draft.season];

  const dirty =
    draft.teamSelection !== stored.teamSelection ||
    draft.competition !== stored.competition ||
    draft.season !== stored.season;
  const isDefault =
    draft.teamSelection === DEFAULT_FILTER.teamSelection &&
    draft.competition === DEFAULT_FILTER.competition &&
    draft.season === DEFAULT_FILTER.season;

  const toggle = (key: SectionKey) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  const patch = (p: Partial<FixtureFilter>) => setDraft((d) => ({ ...d, ...p }));

  const apply = () => {
    setFilter(teamType, draft);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <View
        style={{ height: 66, borderTopWidth: 1, borderTopColor: '#3A0A0B' }}
        className="flex-row items-center justify-center bg-black px-4">
        <Pressable
          onPress={() => setDraft(DEFAULT_FILTER)}
          disabled={isDefault}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Reset filters"
          style={{ position: 'absolute', left: 16 }}>
          <Text
            className="font-body-medium"
            style={{ fontSize: 15, color: isDefault ? ARSENAL.textDim : '#FFF' }}>
            Reset
          </Text>
        </Pressable>
        <Text className="font-body-semibold text-white" style={{ fontSize: 20 }}>
          {`Filter ${TEAM_LABEL[teamType]} Fixtures`}
        </Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Close"
          style={{ position: 'absolute', right: 14 }}>
          <Feather name="x" size={30} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <Section title="TEAMS" open={open.teams} onToggle={() => toggle('teams')}>
          {TEAMS.map((t) => (
            <OptionRow
              key={t}
              label={t}
              selected={draft.teamSelection === t}
              muted
              onPress={() => patch({ teamSelection: t })}
            />
          ))}
        </Section>
        <Section
          title="COMPETITIONS"
          open={open.competitions}
          onToggle={() => toggle('competitions')}>
          {options.loading && !options.data ? (
            <LoadingState padded={false} />
          ) : (
            competitions.map((c) => (
              <OptionRow
                key={c}
                label={c}
                selected={draft.competition === c}
                onPress={() => patch({ competition: c })}
              />
            ))
          )}
        </Section>
        <Section title="SEASON" open={open.season} onToggle={() => toggle('season')}>
          {seasons.map((s) => (
            <OptionRow
              key={s}
              label={s}
              selected={draft.season === s}
              onPress={() => patch({ season: s })}
            />
          ))}
        </Section>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }}>
        <Pressable
          onPress={apply}
          disabled={!dirty}
          accessibilityRole="button"
          accessibilityState={{ disabled: !dirty }}
          style={{
            height: 49,
            borderRadius: 25,
            backgroundColor: dirty ? ARSENAL.red : ARSENAL.applyDisabled,
          }}
          className="items-center justify-center active:opacity-85">
          <Text
            className="font-body-semibold"
            style={{ fontSize: 16, letterSpacing: 0.5, color: dirty ? '#FFF' : '#F6CBD0' }}>
            APPLY
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
