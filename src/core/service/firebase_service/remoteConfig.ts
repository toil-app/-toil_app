import { Platform } from 'react-native';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from '@react-native-firebase/remote-config';
import { createLogger } from '@core/util/AppUtil';

const Logger = createLogger('[remoteConfig]');

type RemoteStrings = Record<string, string>;

/**
 * Fetch a JSON blob keyed by `key` from Firebase Remote Config and parse it.
 */
export async function fetchJsonKey(key: string): Promise<RemoteStrings | null> {
  try {
    const remoteConfig = getRemoteConfig();

    // Set config settings
    remoteConfig.settings = {
      minimumFetchIntervalMillis: Platform.OS === 'ios' ? 0 : 0,
    };

    // Fetch and activate - pass remoteConfig instance
    await fetchAndActivate(remoteConfig);

    // Get the value
    const value = getValue(remoteConfig, key);
    const raw = value?.asString?.() ?? null;

    if (!raw) {
      Logger.warn('Remote config key is empty:', key);
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as RemoteStrings;
      }
    } catch {
      Logger.warn('Remote config key is not valid JSON:', key);
      return null;
    }
  } catch (err) {
    Logger.warn('Failed to fetch remote config key:', key, err);
  }

  return null;
}

/**
 * Convenience: try fetch per-locale JSON under keys like `init_strings_en`.
 */
export async function fetchInitStringsForLocale(
  locale: string,
): Promise<RemoteStrings | null> {
  const key = `init_strings_${locale}`;
  return fetchJsonKey(key);
}

export default {
  fetchInitStringsForLocale,
  fetchJsonKey,
};
