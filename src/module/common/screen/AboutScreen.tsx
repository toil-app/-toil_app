import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
// import SettingListItem from '../../../component/molecules/SettingListItem/SettingListItem';
import { H2, H5, P } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';

const pkg = require('../../../../package.json');

const AboutScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();

    const dynamic = StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background02 ? theme.background02(100) : '#081421' },
        container: { paddingHorizontal: 20, paddingBottom: 40 },
        headerWrap: { alignItems: 'center', paddingTop: 24, paddingBottom: 8 },
        appIconWrap: { width: 96, height: 96, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background01 ? theme.background01(120) : '#0b1220', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10 },
        appTitle: { marginTop: 6, marginBottom: 4, textAlign: 'center' as const },
        versionText: { textAlign: 'center' as const, },
        missionTitle: { marginTop: 24, marginBottom: 8 },
        missionCard: { borderRadius: 12, padding: 16, backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#07101a' },
        missionText: { color: theme.text01 ? theme.text01(100) : '#d1d5db' },
        sectionTitle: { marginTop: 20, marginBottom: 8 },
        card: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#0b1220', backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220' },
        footer: { alignItems: 'center', marginTop: 30 },
        footerText: { color: theme.text02 ? theme.text02(40) : '#6b7280', marginTop: 8, textAlign: 'center' as const }
    });

    // additional small styles derived from theme to avoid inline objects
    const extra = StyleSheet.create({
        iconImage: { width: 56, height: 56, tintColor: theme.primary01 ? theme.primary01(100) : '#1e90ff' as any },
        versionTop: { marginTop: 4 },
        rightText: {},
        divider: { height: 1, backgroundColor: theme.background02 ? theme.background02(25) : '#07101a' },
        cardPadded: { padding: 12, marginBottom: 24 },
        rowTouchable: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
        globeWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: theme.background02 ? theme.background02(80) : '#061827', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
        globeImage: { width: 20, height: 20, tintColor: theme.primary01 ? theme.primary01(100) : '#2563eb' as any },
        visitText: { fontSize: 16, flex: 1 },
        visitArrow: {}
    });

    // const openWebsite = async () => {
    //     const url = 'https://example.com';
    //     try {
    //         await Linking.openURL(url);
    //     } catch (e) {
    //         console.warn('failed to open url', e);
    //     }
    // };

    return (
        <SafeAreaView style={dynamic.screen}>
            <ScrollView contentContainerStyle={dynamic.container}>
                <AuthHeader onBack={() => { }} title={t('about_app') || 'About'} />

                <View style={dynamic.headerWrap}>
                    <View style={dynamic.appIconWrap}>
                        {/* placeholder icon - replace with your app icon asset if available */}
                        <Image source={require('../../../assets/icons/content/sa-check-light.png')} style={extra.iconImage} resizeMode="contain" />
                    </View>
                    <H2 style={dynamic.appTitle}>{'Toil'}</H2>
                    <P style={dynamic.versionText}>{`${'Version'} ${pkg.version || '1.0.0'}`}</P>
                    <P style={[dynamic.versionText, extra.versionTop]}>{t('build_date') ? `${t('build_date')}: 2025.12.27` : 'Build 2025.12.27'}</P>
                </View>

                <View>
                    <H5 style={dynamic.missionTitle}>{t('our_mission') || 'OUR MISSION'}</H5>
                    <View style={dynamic.missionCard}>
                        <P style={dynamic.missionText}>{t('about_mission_text') || "Toil is designed to bring clarity to your chaotic digital life. We believe in software that empowers you without getting in the way. Our mission is to build tools that are as beautiful as they are functional, respecting your privacy and your time."}</P>
                    </View>
                </View>

                {/* <H5 style={dynamic.sectionTitle}>{t('legal_and_attributes') || 'LEGAL & ATTRIBUTES'}</H5>
                <View style={dynamic.card}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <SettingListItem icon="gavel" title={t('licenses') || 'Licenses'} rightComponent={<Text style={extra.rightText}>›</Text>} />
                    </TouchableOpacity>
                    <View style={extra.divider} />
                    <TouchableOpacity activeOpacity={0.8}>
                        <SettingListItem icon="code-tags" title={t('open_source_attributions') || 'Open Source Attributions'} rightComponent={<Text style={extra.rightText}>›</Text>} />
                    </TouchableOpacity>
                    <View style={extra.divider} />
                    <TouchableOpacity activeOpacity={0.8}>
                        <SettingListItem icon="shield-half-full" title={t('privacy_policy') || 'Privacy Policy'} rightComponent={<Text style={extra.rightText}>›</Text>} />
                    </TouchableOpacity>
                </View> */}

                {/* <H5 style={dynamic.sectionTitle}>{t('connect') || 'CONNECT'}</H5>
                <View style={[dynamic.card, extra.cardPadded]}>
                    <TouchableOpacity style={extra.rowTouchable} activeOpacity={0.8} onPress={openWebsite}>
                        <View style={extra.globeWrap}>
                            <Image source={require('../../../assets/icons/content/sa-chevron-down.png')} style={extra.globeImage} resizeMode="contain" />
                        </View>
                        <Text style={extra.visitText}>{t('visit_website') || 'Visit Website'}</Text>
                        <Text style={extra.visitArrow}>⤴</Text>
                    </TouchableOpacity>
                </View> */}

                {/* <View style={dynamic.footer}>
                    <Text style={dynamic.footerText}>{t('copyright_line') || '© 2023 Toil Inc. All rights reserved.'}</Text>
                    <Text style={dynamic.footerText}>{t('made_with_love') || 'Made with ♥ in San Francisco.'}</Text>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutScreen;
