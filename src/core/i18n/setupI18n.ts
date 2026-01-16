import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from '../../../i18n';
import remoteConfig from '../service/firebase_service/remoteConfig';
import remoteLocalization from '../localization/remoteLocalization';
import LocalStorage from '@core/service/LocalStorage.service';
import { StorageKey } from '@core/util/keys';

async function mergeRemoteInitStrings() {
  const locales = Object.keys(resources);
  for (const locale of locales) {
    try {
      const remote = await remoteConfig.fetchInitStringsForLocale(locale);
      if (remote && typeof remote === 'object') {
        // remote may be a flat map of keys or may contain a `translation` namespace
        const payload = (remote as any).translation
          ? (remote as any).translation
          : remote;
        if (payload && typeof payload === 'object') {
          // merge entire payload (no need to list keys up-front)
          const existing = (resources as any)[locale] || {};
          (resources as any)[locale] = { ...existing, ...payload };
          // If i18next already initialized, update resource bundle
          if (i18next.isInitialized) {
            try {
              i18next.addResourceBundle(
                locale,
                'translation',
                payload,
                true,
                true,
              );
            } catch (e) {
              console.warn('Failed to add resource bundle for', locale, e);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error merging remote init strings for', locale, err);
    }
  }
}

export async function initI18n(): Promise<void> {
  // Try to read previously selected language from local storage so the app
  // starts in the user's chosen language.
  let initialLang = 'en';
  try {
    const saved = await LocalStorage.get(StorageKey.SELECTED_LANGUAGE);
    if (saved) {
      // LocalStorage stores values as JSON strings for set, but selected language
      // may have been saved as a plain string. Try JSON.parse then fallback.
      try {
        initialLang = JSON.parse(saved) as string;
      } catch {
        initialLang = saved;
      }
    }
  } catch {
    // ignore and default to 'en'
  }

  if (!i18next.isInitialized) {
    await i18next.use(initReactI18next).init({
      resources,
      lng: initialLang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
  }

  // Try to fetch remote overrides (non-blocking but awaited here so UI shows updated text early)
  try {
    await mergeRemoteInitStrings();
    // Load any previously stored remote localization payload first (fast)
    await remoteLocalization.loadStoredLocalizationFallback();
    // Then try to fetch fresh remote localization and apply
    await remoteLocalization.fetchAndApplyRemoteLocalization();
    // Start a watcher to refresh on foreground
    remoteLocalization.startRemoteLocalizationWatcher();
  } catch (e) {
    console.warn('Remote init strings merge failed', e);
  }
}

export default initI18n;
