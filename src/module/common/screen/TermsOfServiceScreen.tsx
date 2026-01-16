import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H3, H4, H5, P } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';
import { ButtonV1 } from '@components/atoms';

const TermsOfServiceScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: theme.background02 ? theme.background02(100) : '#07121a'
        },
        container: {
            paddingHorizontal: 20,
            paddingBottom: 140
        },
        card: {
            marginTop: 12,
            borderRadius: 12,
            padding: 20,
            backgroundColor: theme.background01 ? theme.background01(100) : '#0b1b24',
            borderWidth: 1,
            borderColor: theme.background02 ? theme.background02(25) : '#0b1220'
        },
        label: {

            fontSize: 12,
            marginBottom: 8,
            fontWeight: '700'
        },
        title: {

            marginBottom: 8
        },
        subtitle: {

            marginBottom: 12
        },
        divider: {
            height: 1,
            backgroundColor: theme.background02 ? theme.background02(20) : '#071723',
            marginVertical: 12
        },
        sectionTitle: {

            fontWeight: '700',
            marginTop: 8,
            marginBottom: 8
        },
        paragraph: {

            marginBottom: 12,
            lineHeight: 20
        },
        bottomBar: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 24,
            alignItems: 'center',
            marginTop: 20,

        }
    });

    const onAgree = () => {
        // TODO: persist acceptance and navigate back
    };

    return (
        <SafeAreaView style={styles.screen}>
            <AuthHeader onBack={() => { }} title={t('terms_of_service') || 'Terms of Service'} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <H3 style={styles.label}>{t('legal_document') || 'LEGAL DOCUMENT'}</H3>
                    <H5 style={styles.title}>{t('terms_of_service') || 'Terms of Service'}</H5>
                    <P style={styles.subtitle}>{t('last_updated', { date: t('terms_last_updated_date') || 'October 24, 2023' }) || 'Last updated: October 24, 2023'}</P>

                    <View style={styles.divider} />

                    <H4 style={styles.sectionTitle}>{t('tos_section_1_title') || '1. Introduction'}</H4>
                    <P style={styles.paragraph}>{t('tos_section_1_text') || 'Welcome to our application. By accessing or using our mobile application, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you disagree with any part of the terms, then you may not access the service.'}</P>

                    <H4 style={styles.sectionTitle}>{t('tos_section_2_title') || '2. Use License'}</H4>
                    <P style={styles.paragraph}>{t('tos_section_2_text') || 'Permission is granted to temporarily download one copy of the materials (information or software) on our application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.'}</P>

                    <H4 style={styles.sectionTitle}>{t('tos_section_3_title') || '3. User Accounts'}</H4>
                    <P style={styles.paragraph}>{t('tos_section_3_text') || 'You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'}</P>

                    {/* Additional sections could be added here */}
                </View>
                <View style={styles.bottomBar} pointerEvents="box-none">
                    <ButtonV1 containerStyle={{ alignSelf: 'center', width: '100%' }} text={t('i_agree') || 'I Agree'} onPress={onAgree} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsOfServiceScreen;
