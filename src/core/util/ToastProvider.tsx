import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewStyle } from 'react-native';
import ToastService from './ToastService';
import { useTranslation } from 'react-i18next';

type ToastType = 'info' | 'success' | 'error';

type ToastOptions = {
    type?: ToastType;
    durationMs?: number;
};

type ToastContextValue = {
    showToast: (message: string, options?: ToastOptions, isLabel?: boolean) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const typeStyles: Record<ToastType, { bg: string; text: string }> = {
    info: { bg: '#333c48ff', text: '#f8fafc' },
    success: { bg: '#589970ff', text: '#f8fafc' },
    error: { bg: '#be7272ff', text: '#f8fafc' },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<ToastType>('info');
    const [visible, setVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLabel, setIsLabel] = useState(true);
    const { t } = useTranslation();

    const clearTimer = useCallback(() => {
        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }
    }, []);

    const animateIn = useCallback(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
            Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
        ]).start();
    }, [opacity, translateY]);

    const animateOut = useCallback((onEnd?: () => void) => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
            Animated.timing(translateY, { toValue: 10, duration: 160, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
        ]).start(() => onEnd?.());
    }, [opacity, translateY]);

    const showToast = useCallback((msg: string, options?: ToastOptions, isLabel: boolean = true) => {
        clearTimer();
        setMessage(msg);
        setType(options?.type ?? 'info');
        setVisible(true);
        animateIn();
        setIsLabel(isLabel);

        hideTimer.current = setTimeout(() => {
            animateOut(() => {
                setVisible(false);
                setMessage(null);
            });
        }, options?.durationMs ?? 2200);
    }, [clearTimer, animateIn, animateOut]);

    useEffect(() => {
        // Register handler with singleton service
        ToastService.setHandler(showToast);
        return () => {
            clearTimer();
            ToastService.setHandler(() => { });
        };
    }, [showToast, clearTimer]);

    const colors = typeStyles[type];

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                    <View style={styles.container}>
                        <Animated.View
                            style={[
                                styles.toast,
                                {
                                    backgroundColor: colors.bg,
                                    opacity,
                                    transform: [{ translateY }],
                                },
                            ]}
                        >
                            <Text style={[styles.text, { color: colors.text }]}>{isLabel ? t(message ?? '') : message}</Text>
                        </Animated.View>
                    </View>
                </View>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    } as ViewStyle,
    toast: {
        minWidth: '70%',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    } as ViewStyle,
    text: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
