import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StoreButton } from '@/components/store/ui/Buttons';
import { StarRating } from '@/components/store/ui/PriceTag';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  REVIEWS_PAGE,
  REVIEW_SORTS,
  askQuestion,
  useMyReviewVotes,
  useQuestions,
  useReviews,
  voteReview,
  writeReview,
  type ReviewSort,
} from '@/lib/api/storeCatalog';
import type { RatingSummary, StoreReview } from '@/types/database';
import { STORE } from '@/theme/store';

const flag = (country: string | null) =>
  country && /^[A-Z]{2}$/.test(country)
    ? String.fromCodePoint(...[...country].map((c) => 0x1f1a5 + c.charCodeAt(0)))
    : '';

const shortDate = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`;
};

function ReviewItem({
  review,
  myVote,
  onVote,
}: {
  review: StoreReview;
  myVote: boolean | undefined;
  onVote: (helpful: boolean) => void;
}) {
  return (
    <View style={{ paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: STORE.divider }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View>
            <View
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#C9CFE0' }}
              className="items-center justify-center">
              <Ionicons name="person" size={20} color="#7C87A6" />
            </View>
            {review.verified ? (
              <View
                style={{
                  position: 'absolute',
                  right: -3,
                  bottom: -3,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: STORE.text,
                  borderWidth: 1.5,
                  borderColor: '#FFF',
                }}
                className="items-center justify-center">
                <Ionicons name="checkmark" size={10} color="#FFF" />
              </View>
            ) : null}
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text className="font-body" style={{ fontSize: 14, color: STORE.text }}>
              {review.author_name} {flag(review.country)}
            </Text>
            {review.verified ? (
              <Text className="font-body" style={{ fontSize: 13, color: STORE.text }}>
                Verified Buyer
              </Text>
            ) : null}
          </View>
        </View>
        <Text className="font-body" style={{ fontSize: 14, color: STORE.text }}>
          {shortDate(review.created_at)}
        </Text>
      </View>
      <View style={{ marginTop: 12 }}>
        <StarRating rating={review.rating} size={22} />
      </View>
      <Text
        className="font-body-semibold"
        style={{ fontSize: 15, color: STORE.text, marginTop: 10 }}>
        {review.title}
      </Text>
      <Text
        className="font-body"
        style={{ fontSize: 15, lineHeight: 22, color: STORE.text, marginTop: 8 }}>
        {review.body}
      </Text>
      <View className="flex-row items-center justify-end" style={{ marginTop: 14 }}>
        <Text
          className="font-body"
          style={{ fontSize: 13.5, color: STORE.textMuted, marginRight: 10 }}>
          Was this review helpful?
        </Text>
        <Pressable
          onPress={() => onVote(true)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Helpful, ${review.helpful_count}`}
          accessibilityState={{ selected: myVote === true }}
          className="flex-row items-center">
          <Feather name="thumbs-up" size={17} color={myVote === true ? STORE.cta : STORE.text} />
          <Text
            className="font-body"
            style={{ fontSize: 13.5, color: STORE.text, marginLeft: 4, marginRight: 12 }}>
            {review.helpful_count}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onVote(false)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Not helpful, ${review.unhelpful_count}`}
          accessibilityState={{ selected: myVote === false }}
          className="flex-row items-center">
          <Feather name="thumbs-down" size={17} color={myVote === false ? STORE.cta : STORE.text} />
          <Text className="font-body" style={{ fontSize: 13.5, color: STORE.text, marginLeft: 4 }}>
            {review.unhelpful_count}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function WriteReviewSheet({
  productId,
  visible,
  onClose,
  onDone,
}: {
  productId: string;
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await writeReview({ productId, rating, title: title.trim(), body: body.trim() });
      setRating(0);
      setTitle('');
      setBody('');
      onDone();
    } catch (e: any) {
      Alert.alert(
        'Couldn’t post your review',
        /duplicate|unique/i.test(e?.message ?? '')
          ? 'You have already reviewed this product.'
          : (e?.message ?? 'Please try again.')
      );
    } finally {
      setSaving(false);
    }
  };

  const field = {
    borderRadius: 8,
    backgroundColor: STORE.muted,
    paddingHorizontal: 14,
    fontSize: 15,
    color: STORE.text,
  };
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Write a review"
      footer={
        <StoreButton
          label="Post review"
          onPress={submit}
          loading={saving}
          disabled={!rating || !title.trim() || !body.trim()}
        />
      }>
      <Text
        className="font-body-semibold"
        style={{ fontSize: 14, color: STORE.text, marginBottom: 8 }}>
        Your rating
      </Text>
      <View className="flex-row" style={{ marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            onPress={() => setRating(i)}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`${i} star${i > 1 ? 's' : ''}`}
            style={{ marginRight: 6 }}>
            <Ionicons name={rating >= i ? 'star' : 'star-outline'} size={32} color={STORE.star} />
          </Pressable>
        ))}
      </View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={STORE.textMuted}
        maxLength={120}
        accessibilityLabel="Review title"
        className="font-body"
        style={[field, { height: 50, marginBottom: 12 }]}
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="What did you like or dislike?"
        placeholderTextColor={STORE.textMuted}
        multiline
        maxLength={3000}
        accessibilityLabel="Review"
        className="font-body"
        style={[field, { minHeight: 120, paddingTop: 12, textAlignVertical: 'top' }]}
      />
      <Text className="font-body" style={{ fontSize: 12.5, color: STORE.textMuted, marginTop: 10 }}>
        Reviews from members who bought this product are marked Verified Buyer.
      </Text>
    </BottomSheet>
  );
}

/** REVIEWS / QUESTIONS tabs under the product details. */
export function Reviews({
  productId,
  rating,
}: {
  productId: string;
  rating: RatingSummary | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<'reviews' | 'questions'>('reviews');
  const [sort, setSort] = useState<ReviewSort>('recent');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(REVIEWS_PAGE);
  const [sheet, setSheet] = useState<'filters' | 'sort' | 'write' | 'ask' | null>(null);
  const [question, setQuestion] = useState('');

  const reviews = useReviews(productId, { sort, rating: starFilter, search, limit });
  const list = reviews.data?.reviews ?? [];
  const votes = useMyReviewVotes(
    user?.id,
    list.map((r) => r.id)
  );
  const questions = useQuestions(productId);

  const requireSignIn = () => {
    router.push('/auth/login');
  };

  const vote = async (review: StoreReview, helpful: boolean) => {
    if (!user) return requireSignIn();
    const current = votes.data?.[review.id];
    try {
      await voteReview(user.id, review.id, current === helpful ? null : helpful);
      await Promise.all([reviews.refetch(), votes.refetch()]);
    } catch {
      Alert.alert('Couldn’t save your vote', 'Please try again.');
    }
  };

  const ask = async () => {
    if (!user) return requireSignIn();
    try {
      await askQuestion(productId, question.trim());
      setQuestion('');
      setSheet(null);
      await questions.refetch();
      Alert.alert('Thanks for your question', 'We’ll answer it here soon.');
    } catch (e: any) {
      Alert.alert('Couldn’t send your question', e?.message ?? 'Please try again.');
    }
  };

  const tabButton = (value: 'reviews' | 'questions', label: string) => (
    <Pressable
      onPress={() => setTab(value)}
      accessibilityRole="tab"
      accessibilityState={{ selected: tab === value }}
      style={{
        flex: 1,
        height: 42,
        paddingHorizontal: 12,
        backgroundColor: tab === value ? STORE.selected : STORE.muted,
      }}
      className="justify-center">
      <Text
        className="font-body-bold"
        style={{ fontSize: 14, letterSpacing: 0.6, color: tab === value ? '#FFF' : STORE.text }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ marginTop: 36 }}>
      <View className="flex-row">
        {tabButton('reviews', 'REVIEWS')}
        {tabButton('questions', 'QUESTIONS')}
      </View>

      {tab === 'reviews' ? (
        <View>
          <View
            style={{ backgroundColor: STORE.muted, marginTop: 34, paddingVertical: 36 }}
            className="items-center">
            {rating ? (
              <View className="flex-row items-center">
                <Text
                  className="font-body"
                  style={{ fontSize: 48, color: STORE.text, marginRight: 12 }}>
                  {rating.average.toFixed(1)}
                </Text>
                <View>
                  <StarRating rating={rating.average} size={24} />
                  <Text
                    className="font-body"
                    style={{ fontSize: 13.5, color: STORE.text, marginTop: 2 }}>
                    Based on {rating.total} review{rating.total === 1 ? '' : 's'}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="font-body" style={{ fontSize: 15, color: STORE.text }}>
                No reviews yet. Be the first to review it.
              </Text>
            )}
            <StoreButton
              label="Write a review"
              variant="dark"
              height={40}
              onPress={() => (user ? setSheet('write') : requireSignIn())}
              style={{ marginTop: 18 }}
            />
          </View>

          {rating ? (
            <>
              <View className="flex-row" style={{ marginTop: 26 }}>
                <View
                  style={{
                    flex: 1.5,
                    height: 48,
                    backgroundColor: STORE.muted,
                    paddingHorizontal: 12,
                    marginRight: 10,
                  }}
                  className="flex-row items-center">
                  <Feather name="search" size={17} color={STORE.text} />
                  <TextInput
                    value={search}
                    onChangeText={(t) => {
                      setSearch(t);
                      setLimit(REVIEWS_PAGE);
                    }}
                    placeholder="SEARCH REVIEWS"
                    placeholderTextColor={STORE.text}
                    accessibilityLabel="Search reviews"
                    className="flex-1 font-body"
                    style={{ fontSize: 13.5, color: STORE.text, marginLeft: 8, height: 46 }}
                  />
                </View>
                <Pressable
                  onPress={() => setSheet('filters')}
                  accessibilityRole="button"
                  accessibilityLabel={starFilter ? `Filters, ${starFilter} stars` : 'Filters'}
                  style={{ flex: 1, height: 48, backgroundColor: STORE.muted }}
                  className="flex-row items-center justify-center">
                  <Feather name="sliders" size={16} color={STORE.text} />
                  <Text
                    className="font-body"
                    style={{ fontSize: 13.5, color: STORE.text, marginLeft: 8 }}>
                    {starFilter ? `${starFilter} STARS` : 'FILTERS'}
                  </Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setSheet('sort')}
                accessibilityRole="button"
                style={{ alignSelf: 'flex-end', marginTop: 16, paddingBottom: 14 }}
                className="flex-row items-center">
                <Text
                  className="font-body"
                  style={{ fontSize: 13.5, color: STORE.text, letterSpacing: 0.4 }}>
                  SORT BY: {REVIEW_SORTS.find((s) => s.value === sort)?.label.toUpperCase()}
                </Text>
                <Ionicons name="caret-down" size={12} color={STORE.cta} style={{ marginLeft: 4 }} />
              </Pressable>
              <View style={{ borderTopWidth: 1, borderTopColor: STORE.divider }}>
                {list.map((r) => (
                  <ReviewItem
                    key={r.id}
                    review={r}
                    myVote={votes.data?.[r.id]}
                    onVote={(h) => vote(r, h)}
                  />
                ))}
                {!list.length && !reviews.loading ? (
                  <Text
                    className="font-body"
                    style={{ fontSize: 15, color: STORE.textMuted, paddingVertical: 20 }}>
                    No reviews match.
                  </Text>
                ) : null}
              </View>
              {(reviews.data?.total ?? 0) > list.length ? (
                <StoreButton
                  label="Load more reviews"
                  variant="secondary"
                  loading={reviews.loading}
                  onPress={() => setLimit((l) => l + REVIEWS_PAGE)}
                  style={{ marginTop: 20 }}
                />
              ) : null}
            </>
          ) : null}
        </View>
      ) : (
        <View style={{ marginTop: 24 }}>
          {(questions.data ?? []).map((q) => (
            <View
              key={q.id}
              style={{
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: STORE.divider,
              }}>
              <Text className="font-body-semibold" style={{ fontSize: 15, color: STORE.text }}>
                Q: {q.question}
              </Text>
              <Text
                className="font-body"
                style={{ fontSize: 13, color: STORE.textMuted, marginTop: 2 }}>
                {q.author_name} · {shortDate(q.created_at)}
              </Text>
              <Text
                className="font-body"
                style={{ fontSize: 15, lineHeight: 22, color: STORE.text, marginTop: 8 }}>
                {q.answer ? `A: ${q.answer}` : 'Awaiting an answer from our team.'}
              </Text>
            </View>
          ))}
          {!(questions.data ?? []).length ? (
            <Text
              className="font-body"
              style={{ fontSize: 15, color: STORE.textMuted, paddingVertical: 12 }}>
              No questions yet.
            </Text>
          ) : null}
          <StoreButton
            label="Ask a question"
            variant="dark"
            height={42}
            onPress={() => (user ? setSheet('ask') : requireSignIn())}
            style={{ marginTop: 18 }}
          />
        </View>
      )}

      <BottomSheet
        visible={sheet === 'filters'}
        onClose={() => setSheet(null)}
        title="Filter reviews">
        {[null, 5, 4, 3, 2, 1].map((n) => (
          <Pressable
            key={n ?? 'all'}
            onPress={() => {
              setStarFilter(n);
              setLimit(REVIEWS_PAGE);
              setSheet(null);
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: starFilter === n }}
            style={{ height: 50, borderBottomWidth: 1, borderBottomColor: STORE.divider }}
            className="flex-row items-center justify-between">
            {n ? (
              <View className="flex-row items-center">
                <StarRating rating={n} size={18} />
                <Text
                  className="font-body"
                  style={{ fontSize: 14, color: STORE.textMuted, marginLeft: 8 }}>
                  {rating?.breakdown[String(n) as '5'] ?? 0}
                </Text>
              </View>
            ) : (
              <Text className="font-body" style={{ fontSize: 15.5, color: STORE.text }}>
                All ratings
              </Text>
            )}
            {starFilter === n ? <Ionicons name="checkmark" size={20} color={STORE.text} /> : null}
          </Pressable>
        ))}
      </BottomSheet>

      <BottomSheet visible={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort reviews">
        {REVIEW_SORTS.map((s) => (
          <Pressable
            key={s.value}
            onPress={() => {
              setSort(s.value);
              setSheet(null);
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: sort === s.value }}
            style={{ height: 50, borderBottomWidth: 1, borderBottomColor: STORE.divider }}
            className="flex-row items-center justify-between">
            <Text
              className={sort === s.value ? 'font-body-bold' : 'font-body'}
              style={{ fontSize: 15.5, color: STORE.text }}>
              {s.label}
            </Text>
            {sort === s.value ? <Ionicons name="checkmark" size={20} color={STORE.text} /> : null}
          </Pressable>
        ))}
      </BottomSheet>

      <WriteReviewSheet
        productId={productId}
        visible={sheet === 'write'}
        onClose={() => setSheet(null)}
        onDone={() => {
          setSheet(null);
          reviews.refetch();
          Alert.alert('Thanks for your review', 'It’s now live on this product.');
        }}
      />

      <BottomSheet
        visible={sheet === 'ask'}
        onClose={() => setSheet(null)}
        title="Ask a question"
        footer={
          <StoreButton label="Send question" onPress={ask} disabled={question.trim().length < 3} />
        }>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="What would you like to know about this product?"
          placeholderTextColor={STORE.textMuted}
          multiline
          maxLength={500}
          accessibilityLabel="Your question"
          className="font-body"
          style={{
            minHeight: 110,
            borderRadius: 8,
            backgroundColor: STORE.muted,
            padding: 14,
            fontSize: 15,
            color: STORE.text,
            textAlignVertical: 'top',
          }}
        />
      </BottomSheet>
    </View>
  );
}
