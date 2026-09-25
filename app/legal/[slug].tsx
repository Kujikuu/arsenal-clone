import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useLegalDocument } from '@/lib/api/account';
import { formatLongDate } from '@/lib/format';
import { PALETTE } from '@/theme/palette';

/** Terms of use / privacy policy, served from public.legal_documents. */
export default function LegalScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: doc, loading, error, refetch } = useLegalDocument(slug);
  const fallbackTitle = slug === 'privacy' ? 'Privacy Policy' : 'Terms Of Use';

  return (
    <SubScreen title={doc?.title ?? fallbackTitle}>
      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : loading && !doc ? (
        <LoadingState />
      ) : !doc ? (
        <EmptyState icon="document-text-outline" title="Document not found" />
      ) : (
        <>
          <Text
            className="font-body"
            style={{ fontSize: 13, color: PALETTE.textMuted, marginTop: 20 }}>
            Last updated {formatLongDate(doc.updated_at)}
          </Text>
          {doc.body.split('\n\n').map((para, i) => {
            const [first, ...rest] = para.split('\n');
            const isHeading = rest.length > 0 && first.length < 60 && !first.endsWith('.');
            return (
              <React.Fragment key={i}>
                {isHeading ? (
                  <Text
                    className="font-body-semibold text-white"
                    style={{ fontSize: 17, marginTop: 22 }}>
                    {first}
                  </Text>
                ) : null}
                <Text
                  className="font-body text-white"
                  style={{ fontSize: 15.5, lineHeight: 23, marginTop: isHeading ? 6 : 16 }}>
                  {isHeading ? rest.join('\n') : para}
                </Text>
              </React.Fragment>
            );
          })}
        </>
      )}
    </SubScreen>
  );
}
