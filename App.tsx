/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/core/modules/store';
import React, { useEffect, useState } from 'react';
import { DarkTheme, LightTheme, ThemeProvider } from '@core/util/Theme';
import { ThemeModeProvider, readPersistedTheme, ThemeChoice, useThemeMode } from './src/core/util/Theme/ThemeModeContext';
import { FontProvider } from '@core/util/fonts';
import { clFont } from '@core/util/fonts/Font';
import initI18n from '@core/i18n/setupI18n';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from '@core/router/RootStack';
import { LoadingScreen } from '@module';
import { createLogger } from '@core/util/AppUtil';
import { ToastProvider } from './src/core/util/ToastProvider';
import { navigationRef } from './src/core/util/NavigationService';

enableScreens();

const logger = createLogger('APP_INIT');

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useThemeMode();
  const systemPrefersDark = useColorScheme() === 'dark';
  const activeTheme = mode === 'system' ? (systemPrefersDark ? DarkTheme : LightTheme) : (mode === 'dark' ? DarkTheme : LightTheme);
  const barStyle = mode === 'system' ? (systemPrefersDark ? 'light-content' : 'dark-content') : (mode === 'dark' ? 'light-content' : 'dark-content');

  return (
    <ThemeProvider theme={activeTheme}>
      <FontProvider font={clFont}>
        <SafeAreaProvider>
          <StatusBar barStyle={barStyle as any} />
          {children}
        </SafeAreaProvider>
      </FontProvider>
    </ThemeProvider>
  );
};

function App() {
  const [i18nReady, setI18nReady] = useState(false);
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('system');

  useEffect(() => {
    let mounted = true;

    const initApp = async () => {
      try {
        // Load persisted theme first
        const persistedTheme = await readPersistedTheme();
        if (mounted) {
          // If no persisted theme, default to 'system'
          setThemeChoice(persistedTheme || 'system');
        }
      } catch (e) {
        logger.error('Failed to read persisted theme', e);
        if (mounted) {
          setThemeChoice('system');
        }
      }

      // Then initialize i18n
      await initI18n()
        .catch((e) => logger.warn('i18n init failed', e));

      if (mounted) {
        setI18nReady(true);
      }
    };

    initApp();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeModeProvider initialMode={themeChoice}>
        <ThemeWrapper>
          <ToastProvider>
            <NavigationContainer ref={navigationRef}>
              {!i18nReady || themeChoice === null ? (
                <LoadingScreen />
              ) : (
                <RootStack />
              )}
            </NavigationContainer>
          </ToastProvider>
        </ThemeWrapper>
      </ThemeModeProvider>
    </Provider>
  );
}

export default App;

