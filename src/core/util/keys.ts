/**
 * Centralized keys for remote config and local storage related to localization.
 * Keep all runtime keys here so environments can import and reference them.
 */
export const RemoteKey = {
  LOCALIZATION_CONFIG: 'LOCALIZATION_CONFIG',
};

export const StorageKey = {
  REMOTE_LOCALIZATION: 'remote_localization_v1',
  SELECTED_LANGUAGE: 'selected_language',
  STORAGE_KEY: 'appTheme',
  KEY_PERSONALIZED: 'privacy_personalized_data',
  KEY_ANALYTICS: 'privacy_analytics_sharing',
  TOKEN_KEY: 'auth_token_v1',
};

export default { RemoteKey, StorageKey };
