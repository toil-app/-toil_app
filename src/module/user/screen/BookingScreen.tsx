import React from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { H4, H5, P, Typography } from '@components/atoms/';
import { ButtonV1 } from '@components/atoms';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Progressbar } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookingScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    // navigation prop for going back
    const navigation: any = useNavigation();

    // static / example values matching the mock
    const bookingId = '#BK-92831';
    const providerName = "John's Plumbing Co.";
    const providerSubtitle = 'Full Week Renovation Support';

    const dynamic = StyleSheet.create({
        safeBg: { backgroundColor: theme.background01(100) },
        headingSpacing: { marginTop: 12 },
        subtitleSpacing: { marginTop: 12, marginHorizontal: 24 },
        providerName: { textAlign: 'left' as const },
        providerSubtitle: { textAlign: 'left' as const, marginTop: 6, color: theme.text02(80) },
        progressWrap: { marginTop: 16 },
        primaryButton: { width: '90%', alignSelf: 'center' },
        secondaryButton: { width: '90%', marginTop: 12, backgroundColor: 'transparent', borderWidth: 1, alignSelf: 'center' },
        statusPrimary: { color: theme.primary01(100) },
        statusMuted: { color: theme.text02(50) },
        secondaryButtonText: { color: theme.text01(100) },
    });

    return (
        <SafeAreaView style={[styles.safe, dynamic.safeBg]}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.checkWrapper}>
                    <View style={[styles.checkCircle, { borderColor: theme.primary01(60), backgroundColor: theme.background02(100) }]}>
                        <Icon name="check" size={42} color={theme.primary01(100)} />
                    </View>
                </View>

                <Typography variant="h1" style={dynamic.headingSpacing}>
                    {t('booking_confirmed_title')}
                </Typography>

                <P size={14} style={dynamic.subtitleSpacing}>
                    {t('booking_confirmed_subtitle')}
                </P>

                <View style={[styles.card, { backgroundColor: theme.background02(100), borderColor: theme.background01(25) }]}>
                    <View style={styles.providerHeader}>
                        <View style={[styles.avatar, { backgroundColor: theme.background01(25) }]}>
                            <Image source={require('@assets/images/avatar-placeholder.png')} style={styles.avatarImage} />
                        </View>
                        <View style={styles.providerText}>
                            <H4 style={dynamic.providerName}>{providerName}</H4>
                            <P size={14} style={dynamic.providerSubtitle}>{providerSubtitle}</P>
                        </View>
                        <TouchableOpacity style={styles.msgIcon}>
                            {/* placeholder for message icon */}
                            <Icon name="message" size={24} color={theme.primary01(100)} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailRow}>
                        <P size={14} style={{ color: theme.text02(80) }}>{t('booking_id_label')}</P>
                        <H5>{bookingId}</H5>
                    </View>

                    <View style={styles.dateRow}>
                        <View style={styles.dateCol}>
                            <P size={12} >{t('start_date')}</P>
                            <H5>Oct 12, 2023</H5>
                            <P size={12} >09:00 AM</P>
                        </View>

                        <View style={styles.dateCol}>
                            <P size={12} >{t('end_date')}</P>
                            <H5>Oct 26, 2023</H5>
                            <P size={12} >05:00 PM</P>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaCol}>
                            <P size={12} >{t('duration')}</P>
                            <H5>2 Weeks</H5>
                            <P size={12} >Mon - Fri</P>
                        </View>

                        <View style={styles.metaCol}>
                            <P size={12} >{t('daily_hours')}</P>
                            <H5>8 Hours</H5>
                            <P size={12} >9AM - 5PM</P>
                        </View>
                    </View>

                    <View style={dynamic.progressWrap}>
                        <Progressbar value={1} max={3} height={8} showLabel={false} />
                        <View style={styles.statusRow}>
                            <P size={12} style={dynamic.statusPrimary}>{t('status_confirmed')}</P>
                            <P size={12} style={dynamic.statusMuted}>{t('status_in_progress')}</P>
                            <P size={12} style={dynamic.statusMuted}>{t('status_completed')}</P>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <ButtonV1 onPress={() => { navigation.navigate('BookingDetailScreen') }} text={t('view_booking_details')} containerStyle={dynamic.primaryButton} />
                    <ButtonV1 onPress={() => { navigation.pop() }} text={t('return_to_home')} containerStyle={[dynamic.secondaryButton, { borderColor: theme.background01(25) }]} textStyle={dynamic.secondaryButtonText} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    container: { alignItems: 'center', padding: 16, paddingBottom: 48 },
    checkWrapper: { alignItems: 'center', marginTop: 24 },
    checkCircle: { width: 104, height: 104, borderRadius: 52, borderWidth: 6, alignItems: 'center', justifyContent: 'center' },
    card: { width: '92%', borderRadius: 12, padding: 16, marginTop: 24, borderWidth: 1 },
    providerHeader: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    avatarImage: { width: '100%', height: '100%' },
    providerText: { flex: 1, marginLeft: 12 },
    msgIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    detailRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    dateCol: { flex: 1, marginRight: 12 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    metaCol: { flex: 1, marginRight: 12 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    actions: { width: '100%', alignItems: 'center', marginTop: 24 },
});

export default BookingScreen;
