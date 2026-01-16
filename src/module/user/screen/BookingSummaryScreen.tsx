import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H4, H5, P } from '@components/atoms/Typhography/variants';
import { relativeWidth, relativeHeight } from '@core/util/Theme/layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonV1, TextInputLikeButton } from '@components/atoms/Button';
import EstimatedTotalCard from '@components/molecules/EstimatedTotalCard/EstimatedTotalCard';
import { DetailCard } from '@components/molecules/card/DetailCard';
import TextInputLable from '@components/atoms/label/TextInputLable';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';;

const { width } = Dimensions.get('window');

const BookingSummaryScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    // mirror of booking state (in a real app this would come from navigation params or context)
    // these are read-only in the summary screen so we only keep values
    const [teamSize] = useState(3);
    const [fixedDuration] = useState(true);
    const [limitedTime] = useState(true);
    const [count] = useState('2');
    const [chargingBasis] = useState('hourly');
    const [unit] = useState<string | number>('weeks');

    const themed = StyleSheet.create({
        container: { backgroundColor: theme.background02 ? theme.background02(100) : '#071018' },
        card: { backgroundColor: theme.background01 ? theme.background01(75) : '#0B1220' },
        primaryBtn: { backgroundColor: theme.primary01 ? theme.primary01(100) : '#1E90FF' },
        textPrimary: { color: theme.text01 ? theme.text01(100) : '#fff' },
    });

    return (
        <SafeAreaView style={[styles.screen, themed.container]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader title={t('booking_review') || 'Booking Review'} onBack={() => { }} />

                    <View style={styles.sectionCard}>
                        <DetailCard
                            title={'123 Main St, New York'}
                            subtitle={t('current_address_example') || '123 Main St, New York'}
                            leftImage={{ iconName: 'location' }}
                            rightImage={{ iconName: 'pencil', onPress: () => { /* edit location */ } }}
                            style={themed.card}
                        />
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('service_details') || 'Service Details'}</H4>

                    {/* Read-only category / sub-category display */}
                    <View style={styles.selectBox}>
                        <TextInputLable label={t('category_label') || 'Category'} />
                        <View style={[styles.readField, themed.card]}>
                            <P themeToken="text01">{t('home_cleaning') || 'Home Cleaning'}</P>
                        </View>
                    </View>

                    <View style={styles.selectBox}>
                        <TextInputLable label={t('sub_category_label') || 'Sub-category'} />
                        <View style={[styles.readField, themed.card]}>
                            <P themeToken="text01">{t('deep_clean_3bed') || 'Deep Clean - 3 Bedroom'}</P>
                        </View>
                    </View>

                    <View style={[styles.groupCard, themed.card]}>
                        <View style={styles.groupHeader}>
                            <H5 style={{ fontWeight: 'bold' }} themeToken="text01">{t('group_provider') || 'Group Provider'}</H5>
                            <View style={[styles.hilightText, { borderColor: theme.primary01 ? theme.primary01(100) : '#1E90FF' }]}>
                                <P style={{ textTransform: 'uppercase', width: 100 }} themeToken="text02">{t('group_range') || '3-5 MEMBERS'}</P>
                            </View>
                        </View>

                        <P themeToken="text02" style={styles.groupNote}>{t('group_note') || 'This service requires a team.'}</P>

                        {/* Read-only required members display */}
                        <View style={styles.requiredRow}>
                            <P themeToken="text02">{t('required_members') || 'Required Members'}</P>
                            <View style={[styles.requiredValueBox, themed.card]}>
                                <P themeToken="text01">{teamSize}</P>
                            </View>
                        </View>
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('duration_schedule') || 'Duration & Schedule'}</H4>

                    <View style={[styles.cardLarge, themed.card]}>
                        <View style={styles.rowBetween}>
                            <TextInputLable label={t('fixed_time_duration') || 'Fixed Time Duration?'} />
                            <P themeToken="text02">{fixedDuration ? (t('yes') || 'Yes') : (t('no') || 'No')}</P>
                        </View>

                        <View style={[styles.rowBetween, styles.mt12]}>
                            <TextInputLable label={t('limited_time_work') || 'LIMITED TIME WORK?'} />
                            <P themeToken="text02">{limitedTime ? (t('yes') || 'Yes') : (t('no') || 'No')}</P>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={{ flex: 0.5, paddingRight: 6 }}>
                                <TextInputLikeButton
                                    label={t('unit') || 'UNIT'}
                                    value={`${t(`${_.lowerCase(unit.toString())}`) || unit.toString()}`}
                                    onPress={() => { /* open duration picker */ }}
                                    containerStyle={{ borderRadius: 8, width: '95%' }}
                                />
                            </View>
                            <View style={{ flex: 0.5, paddingLeft: 6 }}>
                                <TextInputLikeButton
                                    label={t('count', { unit: t(`${_.lowerCase(unit.toString())}`) }) || 'COUNT'}
                                    value={count}
                                    onPress={() => { /* open duration picker */ }}
                                    containerStyle={{ borderRadius: 8, width: '95%' }}
                                />
                            </View>
                        </View>

                        <View style={styles.inputFull}>
                            <TextInputLable label={t('hours_per_day') || 'HOURS / DAY'} />
                            <View style={[styles.readField, themed.card]}>
                                <P themeToken="text01">4</P>
                            </View>
                        </View>

                        <View style={styles.timeRow}>
                            <View style={{ paddingRight: 6, flex: 0.5 }}>
                                <TextInputLikeButton
                                    label={t('arrival') || 'ARRIVAL'}
                                    value={`${'09:00 AM'}`}
                                    onPress={() => { /* open duration picker */ }}
                                    containerStyle={{ borderRadius: 8, width: '95%' }}
                                />
                            </View>
                            <View style={{ paddingLeft: 6, flex: 0.5 }}>
                                <TextInputLikeButton
                                    label={t('departure') || 'DEPARTURE'}
                                    value={`${'01:00 PM'}`}
                                    onPress={() => { /* open duration picker */ }}
                                    containerStyle={{ borderRadius: 8, width: '95%' }}
                                />
                            </View>
                        </View>

                        <View style={[styles.infoBox, themed.card]}>
                            <P themeToken="text02">{t('schedule_note') || 'Schedule applies to every workday within the selected duration.'}</P>
                        </View>
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('charging_basis') || 'Charging Basis'}</H4>
                    <View style={styles.chargingRowWrap}>
                        <View style={[styles.chargingScroll, { flexDirection: 'row' }]}>
                            {/* read-only charging basis pills */}
                            {[
                                { key: 'hourly', label: t('hourly') || 'Hourly' },
                                { key: 'daily', label: t('daily') || 'Daily' },
                                { key: 'weekly', label: t('weekly') || 'Weekly' },
                            ].map((opt) => (
                                <View
                                    key={opt.key}
                                    style={chargingBasis === opt.key ? styles.chipActive : styles.chip}
                                >
                                    <P themeToken={chargingBasis === opt.key ? 'text01' : 'text02'}>{opt.label}</P>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.totalCard}>
                        <EstimatedTotalCard
                            bgShadow={50}
                            amount="$3,500.00"
                            periodLabel={t('total_for_unit_price', { unit: t(`${_.lowerCase(unit.toString())}`) }) || 'Total for 2 Weeks'}
                            note={t('estimate_formula') || 'Base rate × Members × Time'}
                            style={themed.card}
                        />
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('start_date') || 'Start Date'}</H4>
                    <View style={styles.selectBox}>
                        <TextInputLable label={t('start_date') || 'Start Date'} />
                        <View style={[styles.readField, themed.card]}>
                            <P themeToken="text01">{t('start_date_placeholder') || 'MM/DD/YYYY'}</P>
                        </View>
                    </View>

                    <View style={styles.findWrap}>

                        <ButtonV1
                            testID='find_service_provider_btn'
                            text={t('find_service_provider') || 'Find Service Provider'}
                            onPress={() => {
                                navigation.navigate('Bookings', {
                                    screen: 'BookingScreen',
                                });
                            }}
                            containerStyle={[styles.findBtn, themed.primaryBtn]}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};


const styles = StyleSheet.create({
    screen: { flex: 1 },
    container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, minHeight: '100%' },
    sectionCard: { borderRadius: 12, padding: 12, marginTop: relativeHeight(12) },
    locationText: { marginTop: 8 },
    sectionTitle: { marginTop: 16, marginBottom: 8, textAlign: 'left', fontWeight: '700', paddingHorizontal: 12 },
    selectBox: { borderRadius: 12, marginHorizontal: 12, marginBottom: 12 },
    groupCard: { borderRadius: 12, padding: 12, marginBottom: 12, marginHorizontal: 12 },
    groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    groupNote: { marginTop: 4, textAlign: 'left', fontWeight: '600', fontSize: 12 },
    hilightText: { padding: 4, borderRadius: 12, borderWidth: 1 },
    membersRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    counter: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 6 },
    counterBtn: { paddingHorizontal: 12, paddingVertical: 6 },
    counterValue: { marginHorizontal: 12 },
    cardLarge: { borderRadius: 12, padding: 12, marginBottom: 12, marginHorizontal: 12 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowInputs: { flexDirection: 'row', marginTop: 12, },
    mt12: { marginTop: 12 },
    inputSmall: { width: (width - relativeWidth(24) * 2 - 24) / 2, borderRadius: 8, paddingRight: 10 },
    inputFull: { marginTop: 12, borderRadius: 8, padding: 4 },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    timeBox: { width: (width - relativeWidth(24) * 2 - 24) / 2, borderRadius: 8 },
    infoBox: { marginTop: 12, borderRadius: 8, padding: 12 },
    chargingRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    chargingRowWrap: { marginTop: 12, paddingHorizontal: 12 },
    chargingScroll: { alignItems: 'center', paddingLeft: 4, paddingRight: 8 },
    chipWrap: { marginRight: 8 },
    chipActiveWrap: { marginRight: 8 },
    totalCard: { borderRadius: 12, padding: 16, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    estimateNote: { marginTop: 6 },
    totalRight: { alignItems: 'flex-end' },
    findBtn: { marginTop: 20, borderRadius: 14, paddingVertical: 14, alignItems: 'center', alignSelf: 'center' },
    findBtnText: { width: '100%' },
    findWrap: { marginTop: 20 },
    findBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    findIcon: { marginRight: 10 },
    findBtnLabel: { color: '#fff', fontWeight: '700' },
    textAlignLeft: { textAlign: 'left' },
    /* read-only field styles */
    readField: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, minHeight: 44, justifyContent: 'center' },
    readFieldInline: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, justifyContent: 'center' },
    requiredRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    requiredValueBox: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, borderWidth: 1 },
    chipActive: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, backgroundColor: '#2E8BF8' },
});

export default BookingSummaryScreen;
