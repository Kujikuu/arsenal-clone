import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { SEARCH_ARTICLES, SEARCH_VIDEOS, type SearchResult } from '@/lib/data/media';
import { ARSENAL } from '@/theme/arsenal';

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 17 }}>
      <Text className="font-body-semibold text-white" style={{ fontSize: 20 }}>
        {title}{' '}
        <Text className="font-body" style={{ color: '#9A9899' }}>
          ({count})
        </Text>
      </Text>
      <Pressable
        accessibilityRole="button"
        style={{
          height: 33,
          borderRadius: 17,
          paddingHorizontal: 20,
          backgroundColor: ARSENAL.red,
        }}
        className="items-center justify-center active:opacity-80">
        <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
          SEE MORE
        </Text>
      </Pressable>
    </View>
  );
}

/** Search (ref/search.jpeg). */
export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const matches = (item: SearchResult) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase());
  const videos = SEARCH_VIDEOS.filter(matches);
  const articles = SEARCH_ARTICLES.filter(matches);

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader
        left="close"
        backgroundColor={ARSENAL.surface}
        rightAction={<Ionicons name="options-outline" size={28} color="#BDBBBC" />}
      />

      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <View
          style={{ height: 50, borderRadius: 8, backgroundColor: ARSENAL.pill }}
          className="flex-row items-center px-4">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search The Arsenal"
            placeholderTextColor="#C8C6C7"
            returnKeyType="search"
            className="flex-1 font-body text-white"
            style={{ fontSize: 16 }}
          />
          <Ionicons name="search-outline" size={24} color="#C8C6C7" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 40 }}>
        <SectionHeader title="Videos" count={query ? videos.length : 15309} />
        {videos.map((v) => (
          <MediaRowCard
            key={v.id}
            title={v.title}
            image={v.image}
            onPress={() => router.push(`/video/${v.id}`)}
          />
        ))}

        <View style={{ height: 30 }} />

        <SectionHeader title="Articles" count={query ? articles.length : 31165} />
        {articles.map((a) => (
          <MediaRowCard
            key={a.id}
            title={a.title}
            image={a.image}
            onPress={() => router.push(`/article/${a.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
