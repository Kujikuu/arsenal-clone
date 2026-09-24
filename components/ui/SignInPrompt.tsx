import React from 'react';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/ui/States';

/** Placeholder for account screens when nobody is signed in. */
export function SignInPrompt({ message }: { message: string }) {
  const router = useRouter();
  return (
    <EmptyState
      icon="person-circle-outline"
      title="Sign in to continue"
      message={message}
      actionLabel="SIGN IN"
      onAction={() => router.push('/auth/login')}
    />
  );
}
