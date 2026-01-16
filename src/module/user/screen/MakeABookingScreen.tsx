import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H4, H5, P } from '@components/atoms/Typhography/variants';
import { relativeWidth, relativeHeight } from '@core/util/Theme/layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonV1, StepperButton, TextInputLikeButton } from '@components/atoms/Button';
import EstimatedTotalCard from '@components/molecules/EstimatedTotalCard/EstimatedTotalCard';
import Dropdown from '@components/atoms/Dropdown/Dropdown';
import { TextInput as AppTextInput } from '@components/atoms/TextInput';
import { ToggleButton } from '@components/atoms/Button';
import { DetailCard } from '@components/molecules/card/DetailCard';
import TextInputLable from '@components/atoms/label/TextInputLable';
import { DropDownWithLabel } from '@components/atoms';
import { Switch } from '@components/atoms/Switch/Switch';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MakeABooking: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const [teamSize, setTeamSize] = useState(3);
    const [fixedDuration, setFixedDuration] = useState(true);
    const [limitedTime, setLimitedTime] = useState(true);
    const [count, setCount] = useState('2');
    const [chargingBasis, setChargingBasis] = useState('hourly');
    const [unit, setUnit] = useState<string | number>('weeks');
    const [category, setCategory] = useState<string | number>('home_cleaning');
    const [subCategory, setSubCategory] = useState<string | number>('deep_clean_3bed');

    // const [trUnit, setTrUnit] = useState('weeks')

    const themed = StyleSheet.create({
        container: { backgroundColor: theme.background02 ? theme.background02(100) : '#071018' },
        card: { backgroundColor: theme.background01 ? theme.background01(50) : '#0B1220' },
        primaryBtn: { backgroundColor: theme.primary01 ? theme.primary01(100) : '#1E90FF' },
        textPrimary: { color: theme.text01 ? theme.text01(100) : '#fff' },
    });



    return (
        <SafeAreaView style={[styles.screen, themed.container]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader title={t('new_booking') || 'New Booking'} onBack={() => { }} />

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

                    <DropDownWithLabel
                        items={[
                            { id: 'home_cleaning', label: t('home_cleaning') || 'Home Cleaning' },
                            { id: 'plumbing', label: t('plumbing') || 'Plumbing' },
                            { id: 'electrical', label: t('electrical') || 'Electrical' },
                        ]}
                        value={category}
                        onChange={(it) => setCategory(it.id)}
                        placeholder={t('category_label') || 'CATEGORY'}
                        containerStyle={styles.selectBox}
                        boxHeight={44}
                        label={t('category_label') || 'Category'}
                    />

                    <DropDownWithLabel
                        items={[
                            { id: 'deep_clean_3bed', label: t('deep_clean_3bed') || 'Deep Clean - 3 Bedroom' },
                            { id: 'deep_clean_2bed', label: t('deep_clean_2bed') || 'Deep Clean - 2 Bedroom' },
                            { id: 'one_time', label: t('one_time_service') || 'One Time Service' },
                        ]}
                        value={subCategory}
                        onChange={(it) => setSubCategory(it.id)}
                        placeholder={t('sub_category_label') || 'SUB-CATEGORY'}
                        containerStyle={styles.selectBox}
                        boxHeight={44}
                        label={t('sub_category_label') || 'Sub-category'}
                    />

                    <View style={[styles.groupCard, themed.card]}>
                        <View style={styles.groupHeader}>
                            <H5 style={{ fontWeight: 'bold' }} themeToken="text01">{t('group_provider') || 'Group Provider'}</H5>
                            <View style={[styles.hilightText, { borderColor: theme.primary01 ? theme.primary01(100) : '#1E90FF' }]}>
                                <P style={{ textTransform: 'uppercase', width: 100 }} themeToken="text02">{t('group_range') || '3-5 MEMBERS'}</P>
                            </View>
                        </View>

                        <P themeToken="text02" style={styles.groupNote}>{t('group_note') || 'This service requires a team.'}</P>

                        <StepperButton
                            value={teamSize}
                            onDecrement={() => { setTeamSize(Math.max(1, teamSize - 1)); }}
                            onIncrement={() => { setTeamSize(teamSize + 1); }}
                            min={1}
                            decrementBackground={theme.secondary01(100)}
                            incrementBackground={theme.primary01(125)}
                            textColor={theme.light}
                        />
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('duration_schedule') || 'Duration & Schedule'}</H4>

                    <View style={[styles.cardLarge, themed.card]}>
                        <View style={styles.rowBetween}>
                            <TextInputLable label={t('fixed_time_duration') || 'Fixed Time Duration?'} />
                            <Switch value={fixedDuration} onChange={setFixedDuration} />
                        </View>

                        <View style={[styles.rowBetween, styles.mt12]}>
                            <TextInputLable label={t('limited_time_work') || 'LIMITED TIME WORK?'} />
                            <Switch value={limitedTime} onChange={setLimitedTime} />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={{}}>
                                <TextInputLable label={t('unit') || 'UNIT'} />
                                <Dropdown
                                    items={[
                                        { id: 'days', label: t('days') || 'Days' },
                                        { id: 'hour', label: t('hour') || 'Hour' },
                                        { id: 'weeks', label: t('weeks') || 'Weeks' },
                                        { id: 'months', label: t('months') || 'Months' },
                                        { id: 'years', label: t('years') || 'Years' },
                                    ]}
                                    value={unit}
                                    onChange={(it) => setUnit(it.id)}
                                    placeholder={t('unit') || 'UNIT'}
                                    style={styles.inputSmall}
                                    boxHeight={44}
                                />
                            </View>
                            <View style={[styles.inputSmall]}>
                                <AppTextInput
                                    keyboardType='numeric'
                                    type={'number'}
                                    label={t('count', { unit: t(`${_.lowerCase(unit.toString())}`) }) || 'COUNT'}
                                    value={count}
                                    onChangeText={setCount}
                                    width="100%" />
                            </View>
                        </View>

                        <View style={styles.inputFull}>
                            <AppTextInput
                                label={t('hours_per_day_label') || 'HOURS / DAY'}
                                value={'4'}
                                type={'number'}
                                keyboardType='numeric'
                                width="100%" />
                        </View>

                        <View style={styles.timeRow}>
                            <View style={[styles.timeBox, themed.card]}>
                                <TextInputLikeButton
                                    label={t('arrival') || 'ARRIVAL'}
                                    value={'09:00 AM'}
                                    inputStyle={styles.inputSmall}
                                    width={(width - relativeWidth(35) * 2 - 24) / 2}
                                />
                            </View>
                            <View style={[styles.timeBox, themed.card]}>
                                <TextInputLikeButton
                                    label={t('departure') || 'DEPARTURE'}
                                    value={'01:00 PM'}
                                    inputStyle={styles.inputSmall}
                                    width={(width - relativeWidth(35) * 2 - 24) / 2}
                                />
                            </View>
                        </View>

                        <View style={[styles.infoBox, themed.card]}>
                            <P themeToken="text02">{t('schedule_note') || 'Schedule applies to every workday within the selected duration.'}</P>
                        </View>
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('charging_basis') || 'Charging Basis'}</H4>
                    <View style={styles.chargingRowWrap}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chargingScroll}>
                            {[
                                { key: 'hourly', label: t('hourly') || 'Hourly' },
                                { key: 'daily', label: t('daily') || 'Daily' },
                                { key: 'weekly', label: t('weekly') || 'Weekly' },
                                { key: 'monthly', label: t('monthly') || 'Monthly' },
                                { key: 'yearly', label: t('yearly') || 'Yearly' },
                            ].map((opt) => (
                                <ToggleButton
                                    key={opt.key}
                                    label={opt.label}
                                    selected={chargingBasis === opt.key}
                                    onChange={(sel) => { if (sel) setChargingBasis(opt.key); }}
                                    style={chargingBasis === opt.key ? styles.chipActiveWrap : styles.chipWrap}
                                />
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.totalCard}>
                        <EstimatedTotalCard
                            bgShadow={50}
                            amount="$3,500.00"
                            periodLabel={t('total_for_period') || 'Total for 2 Weeks'}
                            note={t('estimate_formula') || 'Base rate × Members × Time'}
                            style={{ backgroundColor: theme.background01 ? theme.background01(50) : '#0B1220' }}
                        />
                    </View>

                    <H4 themeToken="text01" style={styles.sectionTitle}>{t('start_date') || 'Start Date'}</H4>
                    <View style={styles.selectBox}>
                        <TextInputLikeButton
                            containerStyle={{ width: '100%' }}
                            // label={t('start_date') || 'Start Date'}
                            value={t('start_date_placeholder') || 'MM/DD/YYYY'}
                            onPress={() => { /* open date picker */ }}
                        />
                    </View>

                    <View style={styles.findWrap}>

                        <ButtonV1
                            testID='find_service_provider_btn'
                            text={t('find_service_provider') || 'Find Service Provider'}
                            onPress={() => { navigation.navigate('BookingSummaryScreen'); }}
                            containerStyle={[styles.findBtn, themed.primaryBtn]}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
    rowInputs: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
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
    chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
    chipActive: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#2E8BF8' },
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
});

export default MakeABooking;
