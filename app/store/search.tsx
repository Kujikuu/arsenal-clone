import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { StoreButton } from '@/components/store/ui/Buttons';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { useBrowse } from '@/lib/api/storeCatalog';
import { useSettings } from '@/lib/settings/SettingsProvider';
import type { StoreTile } from '@/types/database';
import { STORE } from '@/theme/store';

function ResultRow({ product, onPress }: { product: StoreTile; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={product.title}
      style={{ backgroundColor: STORE.surface, padding: 8, marginBottom: 10 }}
      className="flex-row items-center active:opacity-80">
      <ProductImage uri={product.main_image_url} width={58} height={58} radius={4} />
      <Text
        className="flex-1 font-body-bold"
        numberOfLines={3}
        style={{ fontSize: 14, color: STORE.text, marginLeft: 12, letterSpacing: 0.4 }}>
        {product.title.toUpperCase()}
      </Text>
    </Pressable>
  );
}

/** Search overlay: most popular products first, live suggestions as you type. */
export default function StoreSearchScreen() {
  const router = useRouter();
  const { settings } = useSettings();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(text.trim()), 250);
    return () => clearTimeout(t);
  }, [text]);

  const popular = useBrowse(settings.currency, { limit: 5 });
  const suggestions = useBrowse(settings.currency, { query, limit: 6 }, query.length >= 2);
  const showing = query.length >= 2 ? suggestions : popular;
  const items = showing.data?.products ?? [];

  const submit = () => {
    if (!text.trim()) return;
    router.replace(`/store/c/search?q=${encodeURIComponent(text.trim())}`);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#E6E6E6' }}>
      <StoreHeader left="close" />
      <View
        className="flex-row items-center"
        style={{ backgroundColor: STORE.surface, padding: 16 }}>
        <View
          style={{
            height: 50,
            borderWidth: 1.5,
            borderColor: STORE.headerRed,
            borderRadius: 8,
            paddingLeft: 14,
          }}
          className="flex-1 flex-row items-center">
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={submit}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
            placeholder="Enter a search term"
            placeholderTextColor={STORE.textMuted}
            accessibilityLabel="Search the shop"
            className="flex-1 font-body"
            style={{ fontSize: 16, color: STORE.text, height: 48 }}
          />
          {text ? (
            <Pressable
              onPress={() => setText('')}
              hitSlop={8}
              accessibilityLabel="Clear search"
              style={{ paddingHorizontal: 10 }}>
              <Feather name="x-circle" size={18} color={STORE.textMuted} />
            </Pressable>
          ) : (
            <Feather name="search" size={20} color={STORE.headerRed} style={{ marginRight: 12 }} />
          )}
        </View>
        <StoreButton
          label="Search"
          height={50}
          disabled={!text.trim()}
          onPress={submit}
          style={{ marginLeft: 10, backgroundColor: text.trim() ? STORE.cta : STORE.ctaDisabled }}
        />
      </View>
      <View
        style={{
          backgroundColor: STORE.surface,
          paddingVertical: 14,
          borderTopWidth: 1,
          borderTopColor: STORE.divider,
        }}
        className="items-center">
        <StoreHeading size={14}>
          {query.length >= 2 ? `Results for “${query}”` : 'Most popular products'}
        </StoreHeading>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
        {showing.loading && !items.length ? (
          <ActivityIndicator color={STORE.cta} style={{ marginTop: 24 }} />
        ) : !items.length ? (
          <Text
            className="text-center font-body"
            style={{ fontSize: 15, color: STORE.textMuted, marginTop: 24 }}>
            No products match “{query}”.
          </Text>
        ) : (
          items.map((p) => (
            <ResultRow key={p.id} product={p} onPress={() => router.replace(`/store/${p.id}`)} />
          ))
        )}
        {query.length >= 2 && (suggestions.data?.total ?? 0) > items.length ? (
          <StoreButton
            label={`See all ${suggestions.data?.total} results`}
            variant="secondary"
            onPress={submit}
            style={{ marginTop: 8 }}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}
