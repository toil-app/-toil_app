import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
// load package version from project root
const { version: appVersion } = require('../../../../package.json');
import { Switch } from '@components/atoms/Switch/Switch';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { H5, P } from '@components/atoms';
import { AuthHeader } from "@components/organisms/header";
import SettingListItem from '@components/molecules/SettingListItem/SettingListItem';
import { useNavigation } from '@react-navigation/native';

const Setting: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const [pushEnabled, setPushEnabled] = useState(true);
    const navigation = useNavigation<any>();

    const dynamic = StyleSheet.create({
        screenBg: { flex: 1, backgroundColor: theme.background02 ? theme.background02(100) : '#081421' },
        container: { padding: 16 },
        profileCard: { borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220', borderWidth: 1, borderColor: theme.background01 ? theme.background01(25) : '#0b1220' },
        avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 14, overflow: 'hidden' },
        sectionTitle: { marginTop: 22, marginBottom: 12 },
        card: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#0b1220', backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220' },
        listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, },
        iconWrap: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
        titleWrap: { flex: 1 },
        chevron: { marginLeft: 12 },
        logoutBtn: { marginTop: 24, padding: 16, backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#0b1220' },
        logoutText: { color: theme.negative ? theme.negative(100) : '#ef4444', fontWeight: '700' },
        versionWrap: { marginTop: 18, alignItems: 'center' },
        headerTitle: { textAlign: 'left' as const },
        profileCardSpacing: { marginTop: 12 },
        profileDetails: { flex: 1 },
        textLeft: { textAlign: 'left' as const },
        emailMt: { marginTop: 6 },
        divider: { height: 1, backgroundColor: theme.background02 ? theme.background02(10) : '#041018' },
        iconBgDefault: { backgroundColor: theme.background02 ? theme.background02(25) : '#071723' },
        iconBgAlt: { backgroundColor: '#2b2b2b' },
        smallMt4: { marginTop: 4 },
        iconBgGreen: { backgroundColor: '#1f4a37' },
        iconBgDark: { backgroundColor: '#2b3340' },
        iconBgBlue: { backgroundColor: '#1d3b63' },
        borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.text01 ? theme.text01(25) : '#0b1220' },
    });

    return (
        <SafeAreaView style={dynamic.screenBg}>
            <ScrollView contentContainerStyle={dynamic.container}>
                <AuthHeader title={t('settings')} />

                <TouchableOpacity
                    onPress={() => navigation.navigate('ProfileDetailsScreen')}
                    style={[dynamic.profileCard, dynamic.profileCardSpacing]}>
                    <Image source={require('@assets/images/avatar-placeholder.png')} style={dynamic.avatar} />
                    <View style={dynamic.profileDetails}>
                        <H5 style={dynamic.textLeft}>Alex Doe</H5>
                        <P style={[dynamic.textLeft, dynamic.emailMt]} themeShade={75}>alex.doe@example.com</P>
                    </View>
                    <Icon name="chevron-right" size={28} color={theme.text02 ? theme.light : '#94a3b8'} />
                </TouchableOpacity>

                {/* Account section */}
                <H5 style={[dynamic.sectionTitle, dynamic.textLeft]}>{t('account')}</H5>
                <View style={dynamic.card}>
                    {/* <SettingListItem
                        icon="account"
                        title={t('edit_profile')}
                        borderBottom
                        iconBgStyle={dynamic.iconBgDefault}
                        style={{ ...dynamic.borderBottom, ...dynamic.listItem }}
                        onPress={() => navigation.navigate('ProfileDetailsScreen')}
                    /> */}

                    <SettingListItem
                        icon="shield-lock"
                        title={t('privacy_settings')}
                        iconBgStyle={dynamic.iconBgDefault}
                        onPress={() => navigation.navigate('PrivacyAndTermsScreen')}
                    />
                </View>

                {/* Notifications section */}
                <H5 style={[dynamic.sectionTitle, dynamic.textLeft]}>{t('notifications')}</H5>
                <View style={dynamic.card}>
                    <SettingListItem
                        icon="bell"
                        title={t('push_notifications')}
                        subtitle={t('push_notifications_sub')}
                        borderBottom
                        iconColor="#ca5512ff"
                        iconBgStyle={dynamic.iconBgDefault}
                        style={{ ...dynamic.borderBottom, ...dynamic.listItem }}
                        rightComponent={<Switch value={pushEnabled} onChange={setPushEnabled} />}
                    />

                    <SettingListItem
                        icon="theme-light-dark"
                        title={t('change_theme')}
                        subtitle={t('system')}
                        iconColor="#8255e3ff"
                        borderBottom
                        iconBgStyle={dynamic.iconBgDefault}
                        style={{ ...dynamic.borderBottom, ...dynamic.listItem }}
                        onPress={() => navigation.navigate('ThemeScreen')}
                    />

                    <SettingListItem
                        icon="web"
                        iconColor="#e1137aff"
                        title={t('language')}
                        subtitle={t('language_name') || 'English'}
                        iconBgStyle={dynamic.iconBgDefault}
                        onPress={() => navigation.navigate('LanguageScreen')}
                    />
                </View>

                {/* Support & About */}
                <H5 style={[dynamic.sectionTitle, dynamic.textLeft]}>{t('support_and_about')}</H5>
                <View style={dynamic.card}>
                    <SettingListItem
                        icon="help-circle"
                        title={t('help_support')}
                        borderBottom
                        iconBgStyle={dynamic.iconBgGreen}
                        iconColor="#10b981"
                        style={{ ...dynamic.borderBottom, ...dynamic.listItem }}
                        onPress={() => navigation.navigate('HelpAndSupportScreen')}
                    />

                    <SettingListItem
                        icon="file-document"
                        title={t('terms_of_service')}
                        borderBottom
                        iconBgStyle={dynamic.iconBgDark}
                        iconColor="#9ca3af"
                        style={{ ...dynamic.borderBottom, ...dynamic.listItem }}
                        onPress={() => navigation.navigate('TermsOfServiceScreen')}
                    />

                    <SettingListItem
                        icon="information"
                        title={t('about_app')}
                        iconBgStyle={dynamic.iconBgBlue}
                        iconColor="#60a5fa"
                        onPress={() => navigation.navigate('AboutScreen')}
                    />
                </View>

                <TouchableOpacity style={dynamic.logoutBtn} activeOpacity={0.8}>
                    <H5 style={dynamic.logoutText}>
                        <Icon name="logout" size={18} color={theme.negative ? theme.negative(100) : '#ef4444'} /> {' '}
                        {t('log_out')}
                    </H5>
                </TouchableOpacity>

                <View style={dynamic.versionWrap}>
                    <P themeShade={50}>{`Version ${appVersion}`}</P>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Setting;