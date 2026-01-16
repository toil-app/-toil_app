import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { P, H4, ButtonV1, H5 } from '@components/atoms';
import { useTranslation } from 'react-i18next';
import { AuthHeader } from '@components/organisms/header';
import { relativeWidth } from '@core/util/Theme/layout';
import { useNavigation } from '@react-navigation/native';

// Reusable small timeline dot component. It accepts the precomputed dynamic styles
// from the parent so it doesn't need to re-compute theme values itself.
const TimelineDot: React.FC<{ status: 'completed' | 'inprogress' | 'pending'; styles: any }> = ({ status, styles }) => {
    if (status === 'completed') {
        return (
            <View style={styles.timelineCircleCompleted}>
                <H5 style={styles.checkMarkText}>✓</H5>
            </View>
        );
    }

    if (status === 'inprogress') {
        return (
            <View style={styles.timelineCircleInProgress}>
                <View style={styles.timelineInlineCircleInProgress} />
            </View>
        );
    }

    return <View style={styles.timelineCirclePending} />;
};

const BookingDetailScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation: any = useNavigation();

    const provider = { name: 'Apex Construction', subtitle: '4.8 (120 Reviews)' };
    const address = '842 Willow Creek Dr, San Jose, CA 94088';

    const dynamic = StyleSheet.create({
        screenBg: { backgroundColor: theme.background01 ? theme.background01(100) : '#0f1724' },
        content: { padding: 16 },
        headingMb: { marginBottom: 12 },
        mutedTextMb: { marginBottom: 12 },
        flex1: { flex: 1 },
        subtitleMt: { marginTop: 6, color: theme.text02 ? theme.text02(50) : '#94a3b8' },
        sectionTitle: { marginTop: 18, marginBottom: 8, textAlign: 'left' },
        mapPlaceholder: { height: 120, borderRadius: 8, marginTop: 12, backgroundColor: theme.background02 ? theme.background02(25) : '#111827' },
        gridCol: { flex: 1, marginRight: 12 },
        memberTextWrap: { marginLeft: 12 },
        padded: { padding: 12 },
        actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
        actionBtnHalf: { width: '48%' },
        smallBtn: { width: '100%', height: 36 },
        badgeMuted: { color: theme.text02 ? theme.text02(75) : '#6b7280' },
        addressMt: { marginTop: 8 },
        sectionTitleMt: { marginTop: 18, textTransform: 'uppercase' as const, textAlign: 'left' as const },
        smallGap: { height: 12 },
        mt6: { marginTop: 6, textAlign: 'left' as const, marginLeft: relativeWidth(20) },
        rowBetweenCenter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        valueMt8: { marginTop: 8 },
        alignEnd: { alignItems: 'flex-end' },
        timelineCol: { width: 44, alignItems: 'center' },
        timelineCircleCompleted: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.positive ? theme.positive(80) : '#16a34a' },
        timelineCircleInProgress: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary01 ? theme.primary01(100) : '#1e90ff' },
        timelineCirclePending: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: theme.text02 ? theme.text02(75) : '#475569', backgroundColor: 'transparent' },
        timelineLine: { width: 2, height: 48, marginTop: 4, backgroundColor: theme.background02 ? theme.background01(75) : '#0b1220' },
        timelineContent: { flex: 1 },
        checkMarkText: { color: '#fff', lineHeight: 18, fontSize: 14 },
        textMuted80: { color: theme.text02 ? theme.text02(80) : '#94a3b8' },
        textMuted60: { color: theme.text02 ? theme.text02(60) : '#6b7280' },
        textPrimaryColor: { color: theme.primary01 ? theme.primary01(100) : '#1e90ff' },
        cardStyle: { backgroundColor: theme.background02 ? theme.background02(100) : '#0b1220', borderColor: theme.background01 ? theme.background01(25) : '#0b1220' },
        avatarBg: { backgroundColor: theme.background02 ? theme.background02(25) : '#0b1220' },
        mt12: { marginTop: 12 },
        mt24: { marginTop: 24 },
        timelineInlineCircleInProgress: { width: 7, height: 7, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.light || '#fff' },
    });

    return (
        <ScrollView style={[styles.container, dynamic.screenBg]} contentContainerStyle={dynamic.content}>
            <AuthHeader title={t('project_details')} onBack={() => { }} />

            <P size={12} style={dynamic.mutedTextMb}>{t('booking_id_label')}: #BR-882910</P>

            <View style={[styles.card, dynamic.cardStyle]}>
                <View style={styles.providerRow}>
                    <View style={[styles.avatar, dynamic.avatarBg]}>
                        <Image source={require('@assets/images/avatar-placeholder.png')} style={styles.avatarImg} />
                    </View>
                    <View style={dynamic.flex1}>
                        <H4>{provider.name}</H4>
                        <P size={12} style={dynamic.subtitleMt}>{provider.subtitle}</P>
                    </View>
                </View>
                <View style={dynamic.mt12}>
                    <ButtonV1 onPress={() => { }} text={t('view_provider_profile')} containerStyle={dynamic.smallBtn} />
                </View>
            </View>

            <H5 style={dynamic.sectionTitle}>{t('location_and_schedule')}</H5>

            <View style={[styles.card, dynamic.cardStyle]}>
                <P style={styles.textAlignLeft} size={12}>{t('service_location')}</P>
                <P style={[dynamic.addressMt, styles.textAlignLeft]}>{address}</P>

                <View style={dynamic.mapPlaceholder} />

                <View style={styles.gridRow}>
                    <View style={dynamic.gridCol}>
                        <P style={styles.textAlignLeft} size={12}>{t('start_date')}</P>
                        <H5 style={styles.textAlignLeft}>Oct 12, 2023</H5>
                        <P style={styles.textAlignLeft} size={12}>08:00 AM</P>
                    </View>
                    <View style={dynamic.gridCol}>
                        <P style={styles.textAlignLeft} size={12}>{t('end_date')}</P>
                        <H5 style={styles.textAlignLeft}>Dec 20, 2023</H5>
                        <P style={styles.textAlignLeft} size={12}>05:00 PM</P>
                    </View>
                </View>

                <View style={styles.gridRow}>
                    <View style={dynamic.gridCol}>
                        <P style={styles.textAlignLeft} size={12}>Duration Type</P>
                        <H5 style={styles.textAlignLeft}>Weekly (Mon-Fri)</H5>
                    </View>
                    <View style={dynamic.gridCol}>
                        <P style={styles.textAlignLeft} size={12}>{t('daily_hours')}</P>
                        <H5 style={styles.textAlignLeft}>8 Hours / Day</H5>
                    </View>
                </View>

                <View style={styles.gridRow}>
                    <View style={dynamic.gridCol}>
                        <P style={styles.textAlignLeft} size={12}>Arrival</P>
                        <H5 style={styles.textAlignLeft}>08:00 AM</H5>
                    </View>
                    <View style={dynamic.gridCol}>
                        <P style={styles.textAlignLeft} size={12}>Departure</P>
                        <H5 style={styles.textAlignLeft}>05:00 PM</H5>
                    </View>
                </View>
            </View>

            <H5 style={dynamic.sectionTitleMt}>{t('team_assigned')}</H5>
            <View style={[styles.card, dynamic.cardStyle]}>
                <View style={styles.memberRow}>
                    <View style={styles.avatarSmall} />
                    <View style={dynamic.memberTextWrap}>
                        <H5>Sarah Jenkins</H5>
                        <P size={12}>Project Manager</P>
                    </View>
                </View>
                <View style={styles.memberRow}>
                    <View style={styles.avatarSmall} />
                    <View style={dynamic.memberTextWrap}>
                        <H5>Mike Ross</H5>
                        <P size={12}>Lead Electrician</P>
                    </View>
                </View>
            </View>

            <View style={[styles.rowBetween, dynamic.mt24]}>
                <H5 style={dynamic.sectionTitleMt}>{t('milestones')}</H5>
                <P size={12}>{t('view_all')}</P>
            </View>

            <View style={[styles.card, dynamic.cardStyle]}>
                <View style={dynamic.padded}>
                    {/* Item 1 - Completed */}
                    <View style={styles.timelineRow}>
                        <View style={dynamic.timelineCol}>
                            <TimelineDot status="completed" styles={dynamic} />
                            <View style={dynamic.timelineLine} />
                        </View>
                        <View style={dynamic.timelineContent}>
                            <H5 style={dynamic.mt6}>Demolition & Clean up</H5>
                            <P size={12} style={[dynamic.mt6]}>Completed on Oct 15</P>
                        </View>
                    </View>

                    <View style={dynamic.smallGap} />

                    {/* Item 2 - In progress */}
                    <View style={styles.timelineRow}>
                        <View style={dynamic.timelineCol}>
                            <TimelineDot status="inprogress" styles={dynamic} />
                            <View style={dynamic.timelineLine} />
                        </View>
                        <View style={dynamic.timelineContent}>
                            <H5 style={dynamic.mt6}>Structure Framing</H5>
                            <P size={12} style={[dynamic.mt6]}>In Progress • Due Nov 01</P>
                        </View>
                    </View>

                    <View style={dynamic.smallGap} />

                    {/* Item 3 - Pending */}
                    <View style={styles.timelineRow}>
                        <View style={dynamic.timelineCol}>
                            <TimelineDot status="pending" styles={dynamic} />
                        </View>
                        <View style={dynamic.timelineContent}>
                            <H5 style={[dynamic.badgeMuted, dynamic.mt6]}>Drywall Installation</H5>
                            <P size={12} style={[dynamic.mt6]}>Scheduled Nov 10</P>
                        </View>
                    </View>
                </View>
            </View>

            <H5 style={dynamic.sectionTitleMt}>{t('financials')}</H5>
            <View style={[styles.card, dynamic.cardStyle]}>
                <View style={dynamic.rowBetweenCenter}>
                    <View>
                        <P size={12}>{t('estimated_total_label')}</P>
                        <H5 style={dynamic.valueMt8}>$12,500.00</H5>
                    </View>
                    <View style={dynamic.alignEnd}>
                        <P size={12}>{t('charging_basis_label')}</P>
                        <View style={dynamic.valueMt8}><ButtonV1 onPress={() => { }} text={'Milestone'} textStyle={styles.buttonTextStyle} containerStyle={dynamic.smallBtn} /></View>
                    </View>
                </View>
            </View>

            <View style={dynamic.actionRow}>
                <ButtonV1 onPress={() => { }} textStyle={styles.buttonTextStyle} text={t('reschedule')} containerStyle={dynamic.actionBtnHalf} />
                <ButtonV1 onPress={() => { navigation.navigate('AllUserBookingScreen') }} textStyle={styles.buttonTextStyle} text={t('contact_support')} containerStyle={dynamic.actionBtnHalf} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: relativeWidth(16) },
    card: { borderRadius: 12, padding: 12, borderWidth: 1, marginTop: 8 },
    providerRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
    avatarImg: { width: '100%', height: '100%' },
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    gridCol: { flex: 1, marginRight: 12 },
    memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    avatarSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ccc' },
    buttonTextStyle: { fontSize: 14, textTransform: 'uppercase' },
    textAlignLeft: { textAlign: 'left' as const },
    timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default BookingDetailScreen;
