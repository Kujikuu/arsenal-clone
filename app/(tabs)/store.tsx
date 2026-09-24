import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArsenalHeader } from '@/components/ArsenalHeader';
import { DatabaseStatusBanner } from '@/components/DatabaseStatusBanner';
import { useStoreProducts } from '@/lib/api/store';

const CATEGORIES = ['All', 'Kits', 'Training', 'Retro', 'Accessories'];

export default function StoreScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currency, setCurrency] = useState<'GBP' | 'USD'>('GBP');
  const [refreshing, setRefreshing] = useState(false);

  const { products, loading, error, refetch } = useStoreProducts(
    selectedCategory === 'All' ? undefined : selectedCategory
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const currencySymbol = currency === 'GBP' ? '£' : '$';

  return (
    <View className="flex-1 bg-arsenal-dark">
      <ArsenalHeader
        title="ARSENAL DIRECT"
        subtitle="Official Merchandise"
        rightAction={
          <Pressable
            onPress={() => setCurrency(currency === 'GBP' ? 'USD' : 'GBP')}
            className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 active:opacity-70">
            <Text className="text-xs font-black text-arsenal-gold">
              {currency === 'GBP' ? '£ GBP' : '$ USD'}
            </Text>
          </Pressable>
        }
      />

      {/* Category selector chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="my-3 px-4"
        contentContainerStyle={{ paddingRight: 24 }}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`mr-2 rounded-full border px-3.5 py-1.5 ${
                isSelected
                  ? 'border-arsenal-red bg-arsenal-red'
                  : 'border-arsenal-cardBorder bg-arsenal-card'
              }`}>
              <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#DB0007"
            colors={['#DB0007']}
          />
        }>
        {error && <DatabaseStatusBanner tableName="store_products" onRetry={onRefresh} />}

        {loading && products.length === 0 ? (
          <ActivityIndicator color="#DB0007" className="my-10" />
        ) : (
          <View className="px-4">
            <View className="-mx-2 flex-row flex-wrap">
              {products.map((product) => {
                const price = currency === 'GBP' ? product.price_gbp : product.price_usd;

                return (
                  <View key={product.id} className="mb-4 w-1/2 px-2">
                    <Pressable
                      onPress={() => router.push(`/store/${product.id}`)}
                      className="h-72 flex-col justify-between overflow-hidden rounded-2xl border border-arsenal-cardBorder bg-arsenal-card shadow-md active:opacity-85">
                      {/* Image & Badges */}
                      <View className="relative h-40 bg-slate-900">
                        <Image
                          source={{ uri: product.main_image_url }}
                          className="h-full w-full"
                          resizeMode="cover"
                        />

                        {product.badge && (
                          <View className="absolute left-2 top-2 rounded bg-arsenal-red px-2 py-0.5">
                            <Text className="text-[9px] font-black uppercase tracking-wider text-white">
                              {product.badge}
                            </Text>
                          </View>
                        )}

                        {product.is_customizable && (
                          <View className="absolute bottom-2 right-2 flex-row items-center rounded border border-slate-700 bg-black/80 px-2 py-0.5">
                            <Ionicons name="sparkles" size={10} color="#D4AF37" />
                            <Text className="ml-1 text-[9px] font-bold text-amber-300">
                              Customizable
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Product Info */}
                      <View className="flex-1 justify-between p-3">
                        <View>
                          <Text className="text-[10px] font-bold uppercase text-slate-400">
                            {product.category}
                          </Text>
                          <Text
                            className="mt-0.5 line-clamp-2 text-xs font-bold text-white"
                            numberOfLines={2}>
                            {product.title}
                          </Text>
                        </View>

                        <View className="mt-2 flex-row items-center justify-between border-t border-slate-800 pt-2">
                          <Text className="text-sm font-black text-arsenal-gold">
                            {currencySymbol}
                            {price.toFixed(2)}
                          </Text>
                          <View className="h-6 w-6 items-center justify-center rounded-full bg-arsenal-red/90">
                            <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
