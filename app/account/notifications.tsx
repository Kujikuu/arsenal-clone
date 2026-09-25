import React, { useCallback, useEffect, useState } from 'react';
import { Text, Alert, AppState, Linking } from 'react-native';
import { PillButton } from '@/components/ui/PillButton';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  getPushPermission,
  registerPushToken,
  requestPushPermission,
  type PushPermission,
} from '@/lib/notifications';
import { Card, SectionTitle } from '@/components/ui/Card';
import { SubScreen } from '@/components/ui/SubScreen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useSettings, type Settings } from '@/lib/settings/SettingsProvider';
import { PALETTE } from '@/theme/palette';
import { BRAND } from '@/lib/brand';

type Key = keyof Settings;

const GROUPS: { title: string; rows: { key: Key; title: string; detail: string }[] }[] = [
  {
    title: 'MATCHDAY',
    rows: [
      {
        key: 'notify_kickoff',
        title: 'Kick-off reminders',
        detail: `One hour before every ${BRAND.club} match.`,
      },
      { key: 'notify_lineups', title: 'Team news', detail: 'When the starting XI is announced.' },
      { key: 'notify_goals', title: 'Goals', detail: 'Every goal, as it happens.' },
      { key: 'notify_full_time', title: 'Full time', detail: 'Final score and match report.' },
    ],
  },
  {
    title: 'TEAMS',
    rows: [
      {
        key: 'notify_women',
        title: BRAND.womenTeam,
        detail: 'Include matchday alerts for the women’s team.',
      },
      { key: 'notify_academy', title: 'Academy', detail: 'Include U21, U19 and U18 results.' },
    ],
  },
  {
    title: 'CLUB',
    rows: [
      {
        key: 'notify_news',
        title: 'Breaking news',
        detail: 'Signings, contracts and major announcements.',
      },
      { key: 'notify_tickets', title: 'Tickets', detail: 'When sales you are eligible for open.' },
    ],
  },
];

const PERMISSION_COPY: Record<Exclude<PushPermission, 'granted'>, string> = {
  undetermined: 'Allow notifications so we can send the alerts you choose below.',
  denied: 'Notifications are turned off for this app. Turn them on in your device settings.',
  unsupported: 'Push alerts need the installed app on a physical device.',
};

/** Tracks the OS permission, re-checking when the user comes back from Settings. */
function usePushPermission() {
  const [permission, setPermission] = useState<PushPermission | null>(null);
  const refresh = useCallback(() => {
    getPushPermission()
      .then(setPermission)
      .catch(() => setPermission('unsupported'));
  }, []);
  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => sub.remove();
  }, [refresh]);
  return [permission, setPermission] as const;
}

/** Notification preferences bound to public.user_settings. */
export default function NotificationsScreen() {
  const { settings, update, synced } = useSettings();
  const { user } = useAuth();
  const [permission, setPermission] = usePushPermission();

  const enablePush = async () => {
    const result = await requestPushPermission();
    setPermission(result);
    if (result === 'granted') await registerPushToken();
    else if (result === 'denied') Linking.openSettings();
  };

  const toggle = (key: Key, value: boolean) => {
    if (value && user && permission === 'undetermined') enablePush();
    return update({ [key]: value }).catch(() =>
      Alert.alert('Could not save', 'Your notification settings were not updated.')
    );
  };

  const pushNotice = !user
    ? 'Sign in to receive these alerts on this device.'
    : permission && permission !== 'granted'
      ? PERMISSION_COPY[permission]
      : null;

  return (
    <SubScreen title="Notifications">
      <Text
        className="font-body"
        style={{ fontSize: 14, lineHeight: 20, color: PALETTE.textMuted, marginTop: 20 }}>
        {synced
          ? 'Your choices are saved to your account and apply on every device.'
          : 'Sign in to keep these choices on every device. For now they are saved on this device.'}
      </Text>
      {pushNotice ? (
        <Card style={{ marginTop: 16, padding: 16 }}>
          <Text
            className="font-body"
            style={{ fontSize: 14, lineHeight: 20, color: PALETTE.white }}>
            {pushNotice}
          </Text>
          {user && (permission === 'undetermined' || permission === 'denied') ? (
            <PillButton
              label={permission === 'denied' ? 'OPEN SETTINGS' : 'TURN ON NOTIFICATIONS'}
              onPress={permission === 'denied' ? () => Linking.openSettings() : enablePush}
              style={{ marginTop: 12 }}
            />
          ) : null}
        </Card>
      ) : null}
      {GROUPS.map((group) => (
        <React.Fragment key={group.title}>
          <SectionTitle>{group.title}</SectionTitle>
          <Card>
            {group.rows.map((row, i) => (
              <SwitchRow
                key={row.key}
                title={row.title}
                detail={row.detail}
                value={Boolean(settings[row.key])}
                onValueChange={(v) => toggle(row.key, v)}
                last={i === group.rows.length - 1}
              />
            ))}
          </Card>
        </React.Fragment>
      ))}
    </SubScreen>
  );
}
