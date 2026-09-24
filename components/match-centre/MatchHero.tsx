import React from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DisplayText } from '@/components/ui/DisplayText';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { ARSENAL } from '@/theme/arsenal';

const BANNER = require('@/assets/extracted/mc_live_banner.png');
const BANNER_ASPECT = 296 / 540;

interface TeamSide {
  name: string;
  logo: string;
}

export interface GoalEvent {
  minute: string;
  player: string;
}

interface Props {
  dateLine: string;
  venue: string;
  competitionLogo: string;
  home: TeamSide;
  away: TeamSide;
  score: string;
  homeGoals: GoalEvent[];
  awayGoals: GoalEvent[];
  /** Hidden when the match has no audio stream. */
  onListen?: () => void;
}

function GoalList({ goals, align }: { goals: GoalEvent[]; align: 'left' | 'right' }) {
  const alignItems = align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <View style={{ flex: 1, alignItems, paddingHorizontal: 18 }}>
      {goals.map((goal) => (
        <View key={`${goal.minute}-${goal.player}`} style={{ alignItems, marginBottom: 14 }}>
          <View className="flex-row items-center">
            <Text className="font-body" style={{ fontSize: 15, color: '#C8C6C7' }}>
              {goal.minute}
            </Text>
            <MaterialCommunityIcons
              name="soccer"
              size={15}
              color="#FFF"
              style={{ marginLeft: 4 }}
            />
          </View>
          <Text className="font-body-semibold text-white" style={{ fontSize: 15, marginTop: 6 }}>
            {goal.player}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Team({ team }: { team: TeamSide }) {
  return (
    <View style={{ width: 150 }} className="items-center">
      <TeamLogo uri={team.logo} name={team.name} size={44} />
      <Text className="font-body-semibold text-white" style={{ fontSize: 16, marginTop: 16 }}>
        {team.name}
      </Text>
    </View>
  );
}

/** LIVE banner, fixture meta, score and goal scorers (ref/matchcenter.jpeg). */
export function MatchHero(props: Props) {
  const { width } = useWindowDimensions();
  const divider = { height: 1, marginHorizontal: 16 } as const;

  return (
    <View>
      <Image
        source={BANNER}
        style={{ width, height: width * BANNER_ASPECT, marginTop: 44 }}
        resizeMode="cover"
      />

      <View className="flex-row items-center" style={{ paddingHorizontal: 16, height: 106 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: ARSENAL.surfaceRaised,
          }}
          className="items-center justify-center">
          <Image
            source={{ uri: props.competitionLogo }}
            style={{ width: 24, height: 24, tintColor: '#FFF' }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 items-center" style={{ marginRight: 42 }}>
          <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
            {props.dateLine}
          </Text>
          <Text className="font-body" style={{ fontSize: 15, color: '#B5B3B4', marginTop: 4 }}>
            {props.venue}
          </Text>
        </View>
      </View>

      <View style={[divider, { backgroundColor: '#3B3939' }]} />

      <View
        className="flex-row items-center justify-between"
        style={{ paddingVertical: 22, paddingHorizontal: 16 }}>
        <Team team={props.home} />
        <DisplayText size={30} style={{ marginBottom: 26 }}>
          {props.score}
        </DisplayText>
        <Team team={props.away} />
      </View>

      <View style={[divider, { backgroundColor: ARSENAL.dividerStrong }]} />

      <View className="flex-row" style={{ paddingTop: 10 }}>
        <GoalList goals={props.homeGoals} align="right" />
        <View style={{ width: 1, backgroundColor: ARSENAL.dividerStrong, marginBottom: 6 }} />
        <GoalList goals={props.awayGoals} align="left" />
      </View>

      {props.onListen ? (
        <Pressable
          onPress={props.onListen}
          accessibilityRole="button"
          style={{
            marginHorizontal: 16,
            height: 34,
            borderRadius: 17,
            borderWidth: 1.2,
            borderColor: ARSENAL.red,
          }}
          className="flex-row items-center justify-center active:opacity-75">
          <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
            LISTEN TO AUDIO ONLY
          </Text>
          <Ionicons name="play" size={8} color="#FFF" style={{ marginLeft: 16 }} />
        </Pressable>
      ) : null}
    </View>
  );
}
