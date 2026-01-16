import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H1, P } from '@components/atoms/Typhography/variants';
import packageJson from '../../../../package.json';
import { Asset_V3 } from '@components/atoms';
import { Images } from '@assets/images';
import { relativeHeight, relativeWidth } from '@core/util/Theme/layout';
import { ThemeMode } from '@core/util/Theme';
import { t } from 'i18next';


const LoadingScreen: React.FC = () => {
    const theme: any = useTheme();
    const progressAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    const HERO_BASE_HEIGHT = relativeHeight(370);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [progressAnim]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '97%'],
    });

    const bg =
        typeof theme.background02 === 'function'
            ? theme.background02(100)
            : theme.background02 || '#0A1628';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.imageContainer}>
                <Asset_V3
                    style={[styles.image, { height: HERO_BASE_HEIGHT + insets.top, marginTop: -insets.top }]}
                    source={Images.sa_logo}
                    imageStyle={styles.imageStyle}
                />
            </View>
            <View style={styles.content}>
                {/* App Name */}
                <H1 themeToken="text01" style={styles.appName}>
                    Toil
                </H1>

                {/* Tagline */}
                <P themeToken="text02" themeShade={75} style={styles.tagline}>
                    Service booking made simple
                </P>
                <View style={styles.loadingWrap}>
                    <ActivityIndicator
                        size="large"
                        color={
                            theme.mode === ThemeMode.DARK ? '#fff' : '#000'
                        }
                    />
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBarBackground,
                        {
                            backgroundColor:
                                typeof theme.background01 === 'function'
                                    ? theme.background01(100)
                                    : theme.background01 || '#1E293B',
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.progressBarFill,
                            {
                                width: progressWidth,
                                backgroundColor:
                                    typeof theme.primary01 === 'function'
                                        ? theme.primary01(100)
                                        : theme.primary01 || '#2563EB',
                            },
                        ]}
                    />
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <P themeToken="text02" themeShade={50} style={styles.footerText}>
                    Powered by Toil.
                </P>
                <P themeToken="text02" themeShade={50} style={styles.versionText}>
                    {t('version')}-{packageJson.version}
                </P>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    imageContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: relativeWidth(300),
        resizeMode: 'contain',
    },
    imageStyle: {
        resizeMode: 'contain',
    },
    appName: {
        fontWeight: '700',
        // marginTop: 24,
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
    },
    progressBarContainer: {
        width: '60%',
        marginBottom: 40,
    },
    progressBarBackground: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    footer: {
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 13,
    },
    versionText: {
        fontSize: 12,
    },
    loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' } as any,
});

export default LoadingScreen;
