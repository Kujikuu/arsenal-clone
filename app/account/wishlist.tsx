import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ProductCard } from '@/components/store/ProductCard';
import { SignInPrompt } from '@/components/ui/SignInPrompt';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useWishlistIds, useWishlistProducts } from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useSettings } from '@/lib/settings/SettingsProvider';

/** Products the fan saved with the heart in the shop. */
export default function WishlistScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const wishlist = useWishlistIds();
  const products = useWishlistProducts(user?.id, wishlist.ids);
  const cardWidth = (width - 16 * 2 - 12) / 2;

  if (!user) {
    return (
      <SubScreen title="Wishlist">
        {authLoading ? (
          <LoadingState />
        ) : (
          <SignInPrompt message="Sign in to save products for later." />
        )}
      </SubScreen>
    );
  }

  // Hearts removed here disappear straight away.
  const list = (products.data ?? []).filter((p) => wishlist.ids.includes(p.id));

  return (
    <SubScreen title="Wishlist" onRefresh={products.refetch}>
      {products.error ? (
        <ErrorState error={products.error} onRetry={products.refetch} />
      ) : products.loading && !list.length ? (
        <LoadingState />
      ) : !list.length ? (
        <EmptyState
          icon="heart-outline"
          title="Nothing saved yet"
          message="Tap the heart on any product to keep it here."
          actionLabel="BROWSE THE SHOP"
          onAction={() => router.push('/store')}
        />
      ) : (
        <View className="flex-row flex-wrap" style={{ paddingTop: 16, marginRight: -12 }}>
          {list.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              width={cardWidth}
              currency={settings.currency}
              saved
              onPress={() => router.push(`/store/${product.id}`)}
              onToggleSaved={() => wishlist.toggle(product.id)}
            />
          ))}
        </View>
      )}
    </SubScreen>
  );
}
