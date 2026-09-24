import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useStoreProduct } from '@/lib/api/store';

const PLAYER_PRESETS = [
  { name: 'SAKA', number: '7' },
  { name: 'ØDEGAARD', number: '8' },
  { name: 'RICE', number: '41' },
  { name: 'HAVERTZ', number: '29' },
  { name: 'SALIBA', number: '2' },
  { name: 'MARTINELLI', number: '11' },
];

export default function ProductDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { product, loading } = useStoreProduct(id as string);

  const [selectedSize, setSelectedSize] = useState('L');
  const [customName, setCustomName] = useState('SAKA');
  const [customNumber, setCustomNumber] = useState('7');
  const [viewMode, setViewMode] = useState<'product' | 'customizer'>('customizer');

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-arsenal-dark">
        <ActivityIndicator size="large" color="#DB0007" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-arsenal-dark p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-bold text-white">Product Not Found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-lg bg-arsenal-red px-4 py-2">
          <Text className="font-bold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleBuy = async () => {
    const targetUrl = product.external_buy_url || 'https://arsenaldirect.arsenal.com';
    if (Platform.OS !== 'web') {
      await WebBrowser.openBrowserAsync(targetUrl);
    } else {
      Linking.openURL(targetUrl);
    }
  };

  return (
    <View className="flex-1 bg-arsenal-dark">
      {/* Top Bar */}
      <View
        style={{ paddingTop: Math.max(insets.top, 12) + 4 }}
        className="flex-row items-center justify-between border-b border-slate-800 bg-slate-950 px-4 pb-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-800 active:opacity-70">
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </Pressable>

        <Text className="text-xs font-black uppercase tracking-widest text-white">
          {product.category}
        </Text>

        <View className="w-9" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* VIEW MODE TOGGLE FOR CUSTOMIZABLE SHIRTS */}
        {product.is_customizable && (
          <View className="mx-4 mt-3 flex-row rounded-xl border border-slate-800 bg-slate-900 p-1">
            <Pressable
              onPress={() => setViewMode('customizer')}
              className={`flex-1 items-center rounded-lg py-1.5 ${
                viewMode === 'customizer' ? 'bg-arsenal-red' : 'bg-transparent'
              }`}>
              <Text
                className={`text-xs font-black uppercase ${
                  viewMode === 'customizer' ? 'text-white' : 'text-slate-400'
                }`}>
                Shirt Customizer
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('product')}
              className={`flex-1 items-center rounded-lg py-1.5 ${
                viewMode === 'product' ? 'bg-arsenal-red' : 'bg-transparent'
              }`}>
              <Text
                className={`text-xs font-black uppercase ${
                  viewMode === 'product' ? 'text-white' : 'text-slate-400'
                }`}>
                Photo Gallery
              </Text>
            </Pressable>
          </View>
        )}

        {/* HERO IMAGE OR LIVE SHIRT CUSTOMIZER PREVIEW */}
        {product.is_customizable && viewMode === 'customizer' ? (
          <View className="relative mx-4 mt-4 h-72 items-center justify-center overflow-hidden rounded-3xl border-2 border-red-500/50 bg-gradient-to-b from-red-700 via-arsenal-red to-red-950 shadow-2xl">
            {/* White Sleeves outline simulation */}
            <View className="absolute inset-y-0 left-0 w-12 rounded-l-3xl bg-white/90 opacity-90" />
            <View className="absolute inset-y-0 right-0 w-12 rounded-r-3xl bg-white/90 opacity-90" />

            <View className="z-10 items-center">
              <Text className="text-2xl font-black uppercase tracking-widest text-white/90 shadow-md">
                {customName || 'GUNNER'}
              </Text>
              <Text className="mt-1 text-8xl font-black tracking-tight text-white shadow-lg">
                {customNumber || '10'}
              </Text>
              <View className="mt-2 rounded-full bg-black/40 px-3 py-1">
                <Text className="text-[10px] font-bold tracking-widest text-amber-300">
                  OFFICIAL ARSENAL 24/25 FONT
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="relative mx-4 mt-4 h-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <Image
              source={{ uri: product.main_image_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        )}

        {/* PRODUCT DETAILS */}
        <View className="p-5">
          <View className="mb-2 flex-row items-center justify-between">
            <View className="rounded bg-arsenal-red px-2.5 py-0.5">
              <Text className="text-[10px] font-black uppercase tracking-wider text-white">
                {product.badge || 'OFFICIAL PRODUCT'}
              </Text>
            </View>
            <Text className="text-2xl font-black text-arsenal-gold">
              £{product.price_gbp.toFixed(2)}
            </Text>
          </View>

          <Text className="text-xl font-black leading-snug text-white">{product.title}</Text>

          <Text className="mt-2.5 text-xs leading-relaxed text-slate-300">
            {product.description}
          </Text>

          {/* PLAYER PRESET CHIPS */}
          {product.is_customizable && (
            <View className="mt-5">
              <Text className="mb-2 text-xs font-black uppercase tracking-wider text-white">
                Choose Player or Enter Custom
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row space-x-2">
                {PLAYER_PRESETS.map((p) => {
                  const isSelected = customName === p.name && customNumber === p.number;
                  return (
                    <Pressable
                      key={p.name}
                      onPress={() => {
                        setCustomName(p.name);
                        setCustomNumber(p.number);
                      }}
                      className={`mr-2 rounded-xl border px-3 py-2 ${
                        isSelected
                          ? 'border-arsenal-red bg-arsenal-red'
                          : 'border-slate-800 bg-slate-900'
                      }`}>
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}>
                        {p.name} {p.number}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Custom Input Fields */}
              <View className="mt-3 flex-row space-x-3">
                <View className="flex-2 mr-2 flex-grow">
                  <Text className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                    Custom Name
                  </Text>
                  <TextInput
                    value={customName}
                    onChangeText={(txt) => setCustomName(txt.toUpperCase().slice(0, 12))}
                    placeholder="YOUR NAME"
                    placeholderTextColor="#64748B"
                    className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs font-black uppercase text-white"
                  />
                </View>

                <View className="w-24">
                  <Text className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                    Number
                  </Text>
                  <TextInput
                    value={customNumber}
                    onChangeText={(txt) => setCustomNumber(txt.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor="#64748B"
                    className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center text-xs font-black text-white"
                  />
                </View>
              </View>
            </View>
          )}

          {/* SIZE SELECTOR */}
          <View className="mt-5">
            <Text className="mb-2 text-xs font-black uppercase tracking-wider text-white">
              Select Size
            </Text>
            <View className="flex-row space-x-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSelectedSize(s)}
                    className={`mr-2 h-12 w-12 items-center justify-center rounded-xl border ${
                      isSelected
                        ? 'border-arsenal-red bg-arsenal-red'
                        : 'border-slate-800 bg-slate-900'
                    }`}>
                    <Text
                      className={`text-xs font-black ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}>
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* CHECKOUT ACTION */}
          <Pressable
            onPress={handleBuy}
            className="mt-6 flex-row items-center justify-center rounded-2xl bg-arsenal-red py-4 shadow-2xl active:opacity-85">
            <Ionicons name="bag-check" size={20} color="#FFFFFF" />
            <Text className="ml-2 text-sm font-black uppercase tracking-wider text-white">
              Buy on Arsenal Direct (£{product.price_gbp.toFixed(2)})
            </Text>
          </Pressable>
          <Text className="mt-2 text-center text-[10px] text-slate-500">
            Secure checkout directly at arsenaldirect.arsenal.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
