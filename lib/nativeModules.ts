import { TurboModuleRegistry } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

/**
 * Native modules only exist in builds made after they were added. Older dev
 * clients (and Expo Go) lack them, so features check before loading them.
 */
export const hasCalendarModule = (): boolean => requireOptionalNativeModule('ExpoCalendar') != null;

export const hasWebViewModule = (): boolean => TurboModuleRegistry.get('RNCWebViewModule') != null;

export const MISSING_NATIVE_MODULE_MESSAGE =
  'This feature needs the latest version of the app. Please update or rebuild it.';
