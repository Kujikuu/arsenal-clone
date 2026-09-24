import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DisplayText } from '@/components/ui/DisplayText';
import { useNow } from '@/lib/useNow';
import type { FanPoll } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

interface Props {
  poll: FanPoll;
  onVote: (optionId: string) => void;
}

/** Fan vote with live percentages once the fan has voted. */
export function PollCard({ poll, onVote }: Props) {
  const voted = Boolean(poll.user_voted_option_id);
  const now = useNow();
  const closed = new Date(poll.ends_at).getTime() < now;
  const showResults = voted || closed;

  return (
    <View
      style={{ backgroundColor: ARSENAL.surface, borderRadius: 8, padding: 16, marginBottom: 17 }}>
      <DisplayText size={12} color="#C8C6C7" heavy={false}>
        {poll.category.toUpperCase()}
      </DisplayText>
      <Text className="font-body-semibold text-white" style={{ fontSize: 18, marginTop: 8 }}>
        {poll.title}
      </Text>
      <Text className="font-body" style={{ fontSize: 14, color: ARSENAL.textMuted, marginTop: 4 }}>
        {poll.description}
      </Text>

      <View style={{ marginTop: 14 }}>
        {poll.options.map((option) => {
          const pct = poll.total_votes
            ? Math.round((option.votes_count / poll.total_votes) * 100)
            : 0;
          const mine = option.id === poll.user_voted_option_id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onVote(option.id)}
              disabled={showResults}
              accessibilityRole="button"
              accessibilityLabel={`Vote for ${option.label}`}
              style={{
                height: 52,
                borderRadius: 6,
                marginBottom: 8,
                backgroundColor: ARSENAL.surfaceRaised,
                borderWidth: mine ? 1 : 0,
                borderColor: ARSENAL.red,
              }}
              className="justify-center overflow-hidden active:opacity-80">
              {showResults && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${pct}%`,
                    backgroundColor: mine ? 'rgba(211,45,47,0.45)' : ARSENAL.chip,
                  }}
                />
              )}
              <View className="flex-row items-center px-3">
                <View className="flex-1">
                  <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
                    {option.label}
                  </Text>
                  {option.sub_label ? (
                    <Text className="font-body" style={{ fontSize: 12, color: '#C8C6C7' }}>
                      {option.sub_label}
                    </Text>
                  ) : null}
                </View>
                {showResults ? (
                  <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
                    {pct}%
                  </Text>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#FFF" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text className="font-body" style={{ fontSize: 12.5, color: ARSENAL.textDim, marginTop: 2 }}>
        {poll.total_votes.toLocaleString('en-GB')} votes
        {closed ? ' · Voting closed' : voted ? ' · Thanks for voting' : ''}
      </Text>
    </View>
  );
}
