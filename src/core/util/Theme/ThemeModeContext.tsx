import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@core/service/LocalStorage.service';
import { StorageKey } from '@core/util/keys';

const STORAGE_KEY = StorageKey.STORAGE_KEY;
export type ThemeChoice = 'light' | 'dark' | 'system';

const ThemeModeContext = createContext<{
    mode: ThemeChoice;
    setMode: (m: ThemeChoice) => void;
} | undefined>(undefined);

export const ThemeModeProvider = ({ children, initialMode }: { children: ReactNode; initialMode?: ThemeChoice }) => {
    const [mode, setModeState] = useState<ThemeChoice>(initialMode ?? 'system');

    // Persist theme choice whenever it changes (store plain string)
    const persistThemeChoice = async (mode: ThemeChoice) => {
        AsyncStorage.setAsyncStorage(STORAGE_KEY, mode).catch((e) =>
            console.warn('Failed to persist theme choice', e),
        );
    };

    // Only update internal state if initialMode is explicitly provided and differs
    // This prevents resetting to the initial value after first render
    useEffect(() => {
        if (initialMode && initialMode !== mode) {
            setModeState(initialMode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialMode]);

    const setMode = (m: ThemeChoice) => {
        setModeState(m);
        persistThemeChoice(m);
    };

    return <ThemeModeContext.Provider value={{ mode, setMode }}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => {
    const ctx = useContext(ThemeModeContext);
    if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
    return ctx;
};

export const readPersistedTheme = async (): Promise<ThemeChoice | null> => {
    try {
        const v = await AsyncStorage.get(STORAGE_KEY); // may be raw or JSON-stringified
        if (!v) return null;

        let val: any = v;
        try {
            val = JSON.parse(v);
        } catch {
            // not JSON, use raw
        }

        if (val === 'light' || val === 'dark' || val === 'system') return val as ThemeChoice;
        return null;
    } catch {
        return null;
    }
};

export default ThemeModeContext;
