import remoteConfig from '@react-native-firebase/remote-config';
import { createLogger } from '../util/AppUtil';

const Logger = createLogger('[RemoteConfig]');

export interface RemoteLocalizationConfig {
  CLEAR_CACHE: boolean;
  languages: Record<string, string>;
}

class RemoteConfigService {
  private remoteConfig = remoteConfig();
  private initialized = false;

  async initialize(): Promise<void> {
    try {
      if (this.initialized) return;

      const settings = {
        minimumFetchIntervalMillis: 3600000, // 1 hour
        fetchTimeoutMillis: 60000,
      };

      await this.remoteConfig.setConfigSettings(settings);
      await this.remoteConfig.fetchAndActivate();

      this.initialized = true;
      Logger.log('Remote Config initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize Remote Config', error);
      throw error;
    }
  }

  async getLocalizationConfig(): Promise<RemoteLocalizationConfig | null> {
    try {
      await this.initialize();

      const configValue = this.remoteConfig.getValue('remote_localization_v1');

      if (!configValue || !configValue.asString()) {
        Logger.log('No remote localization config found');
        return null;
      }

      const config = JSON.parse(configValue.asString());
      Logger.log('Fetched remote localization config :', config);

      return config as RemoteLocalizationConfig;
    } catch (error) {
      Logger.error('Failed to get localization config', error);
      return null;
    }
  }

  async getString(key: string, defaultValue?: string): Promise<string> {
    try {
      await this.initialize();
      const value = this.remoteConfig.getValue(key);
      return value?.asString() || defaultValue || '';
    } catch (error) {
      Logger.error(`Failed to get string value for key: ${key}`, error);
      return defaultValue || '';
    }
  }

  async getNumber(key: string, defaultValue?: number): Promise<number> {
    try {
      await this.initialize();
      const value = this.remoteConfig.getValue(key);
      return value?.asNumber() || defaultValue || 0;
    } catch (error) {
      Logger.error(`Failed to get number value for key: ${key}`, error);
      return defaultValue || 0;
    }
  }

  async getBoolean(key: string, defaultValue?: boolean): Promise<boolean> {
    try {
      await this.initialize();
      const value = this.remoteConfig.getValue(key);
      return value?.asBoolean() || defaultValue || false;
    } catch (error) {
      Logger.error(`Failed to get boolean value for key: ${key}`, error);
      return defaultValue || false;
    }
  }
}

export default new RemoteConfigService();
