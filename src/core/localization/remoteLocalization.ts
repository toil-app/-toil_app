import { AppState, AppStateStatus } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalStorage from '@core/service/LocalStorage.service';
import i18next from 'i18next';
import remoteConfig from '../service/firebase_service/remoteConfig';
import { RemoteKey, StorageKey } from '../util/keys';
import { createLogger } from '@core/util/AppUtil';

const Logger = createLogger('[RemoteLocalization]');

type RemotePayload = {
  CLEAR_CACHE?: boolean;
  languages?: Record<string, Record<string, string>>;
};

async function parseAndApply(payload: RemotePayload | string | null) {
  if (!payload) return false;
  let parsed: RemotePayload;
  try {
    parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
  } catch (err) {
    Logger.error('Failed parsing localization payload', err);
    return false;
  }

  if (parsed.CLEAR_CACHE) {
    await LocalStorage.remove(StorageKey.REMOTE_LOCALIZATION);
  }

  const languages = parsed.languages ?? {};
  // persist
  try {
    await LocalStorage.set(
      StorageKey.REMOTE_LOCALIZATION,
      JSON.stringify(parsed),
    );
  } catch (err) {
    Logger.error('Failed to persist localization payload', err);
  }

  // Merge into i18next resources
  Object.entries(languages).forEach(([lang, resources]) => {
    try {
      if (i18next.hasResourceBundle(lang, 'translation')) {
        i18next.addResourceBundle(lang, 'translation', resources, true, true);
      } else {
        i18next.addResourceBundle(lang, 'translation', resources, true, false);
      }
    } catch (err) {
      console.warn('Failed merging resources for', lang, err);
    }
  });

  // reload current language if updated
  const current = i18next.language;
  if (current && languages[current]) {
    try {
      // trigger a reload so react-i18next updates views
      // reloadResources expects an array of language codes
      await i18next.reloadResources([current]);
      i18next.changeLanguage(current);
    } catch (err) {
      console.warn('Failed to reload resources for', current, err);
    }
  }

  return true;
}

export async function fetchAndApplyRemoteLocalization(): Promise<boolean> {
  try {
    const value = await remoteConfig.fetchJsonKey(
      RemoteKey.LOCALIZATION_CONFIG,
    );
    Logger.info('Fetched remote localization config :', value);
    if (!value) return false;
    return await parseAndApply(value as RemotePayload);
  } catch (err) {
    Logger.error('Failed fetching remote localization', err);
    return false;
  }
}

export async function loadStoredLocalizationFallback(): Promise<boolean> {
  try {
    const raw = await LocalStorage.get(StorageKey.REMOTE_LOCALIZATION);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as RemotePayload;
    return await parseAndApply(parsed);
  } catch {
    // ignore
    return false;
  }
}

export function startRemoteLocalizationWatcher() {
  let currentState = AppState.currentState;
  AppState.addEventListener('change', async (next: AppStateStatus) => {
    if (currentState.match(/inactive|background/) && next === 'active') {
      try {
        await fetchAndApplyRemoteLocalization();
      } catch {
        // swallow
      }
    }
    currentState = next;
  });
}

export default {
  fetchAndApplyRemoteLocalization,
  loadStoredLocalizationFallback,
  startRemoteLocalizationWatcher,
};
