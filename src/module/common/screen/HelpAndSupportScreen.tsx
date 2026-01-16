import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import SettingListItem from '../../../component/molecules/SettingListItem/SettingListItem';
import { H5 } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';

const pkg = require('../../../../package.json');

const HelpAndSupportScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();

    const dynamic = StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background02 ? theme.background02(100) : '#081421' },
        container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
        section: { marginTop: 18, marginBottom: 6 },
        card: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#0b1220', backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220', marginBottom: 12 },
        divider: { height: 1, backgroundColor: theme.background02 ? theme.background02(20) : '#0b1a25' },
        footer: { alignItems: 'center', marginTop: 30 },
        footerText: { color: theme.text02 ? theme.text02(40) : '#6b7280', marginTop: 6 },
        sectionTitle: { marginBottom: 8, textAlign: 'left' },
        borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.text01 ? theme.text01(25) : '#0b1220' },
    });

    return (
        <SafeAreaView style={dynamic.screen}>
            <ScrollView contentContainerStyle={dynamic.container}>
                <AuthHeader onBack={() => { }} title={t('help_support') || 'Help & Support'} />

                <View style={dynamic.section}>
                    <H5 style={dynamic.sectionTitle}>{t('contact_us') || 'CONTACT US'}</H5>
                    <View style={dynamic.card}>
                        <SettingListItem
                            icon="message-text"
                            iconColor="#2563eb"
                            title={t('contact_support') || 'Contact Support'}
                            subtitle={t('contact_support_sub') || 'Start a chat or send email'}
                            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#0b2a44' }}
                            style={dynamic.borderBottom}
                        />
                        <View style={dynamic.divider} />
                        <SettingListItem
                            icon="phone"
                            iconColor="#059669"
                            title={t('call_us') || 'Call Us'}
                            subtitle={t('call_us_sub') || 'For urgent issues'}
                            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#07261a' }}
                        />
                    </View>
                </View>

                <View style={dynamic.section}>
                    <H5 style={dynamic.sectionTitle}>{t('self_service_resources') || 'SELF-SERVICE RESOURCES'}</H5>
                    <View style={dynamic.card}>
                        <SettingListItem
                            icon="help-circle"
                            iconColor="#7c3aed"
                            title={t('faq') || 'Frequently Asked Questions'}
                            subtitle={t('faq_sub') || ''}
                            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#1b0b2b' }}
                            style={dynamic.borderBottom}
                        />
                        <View style={dynamic.divider} />
                        <SettingListItem
                            icon="book-open"
                            iconColor="#ea580c"
                            title={t('user_guide') || 'User Guide'}
                            subtitle={t('user_guide_sub') || ''}
                            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#2a1206' }}
                            style={dynamic.borderBottom}
                        />
                        <View style={dynamic.divider} />
                        <SettingListItem
                            icon="shield-half-full"
                            iconColor="#6b7280"
                            title={t('privacy_and_terms') || 'Privacy & Terms'}
                            subtitle={t('privacy_and_terms_sub') || ''}
                            iconBgStyle={{ backgroundColor: theme.background02 ? theme.background02(80) : '#0f1720' }}
                        />
                    </View>
                </View>

                <View style={dynamic.footer}>
                    <Text style={dynamic.footerText}>{t('support_id') ? `${t('support_id')}: #8839-2910` : 'Support ID: #8839-2910'}</Text>
                    <Text style={dynamic.footerText}>{`App Version ${pkg.version || '1.0.0'}`}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpAndSupportScreen;
