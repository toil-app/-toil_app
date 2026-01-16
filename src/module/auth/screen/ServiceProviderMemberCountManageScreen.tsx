import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SearchTextInput } from '@components/atoms/TextInput/SearchTextInput';
import { ToggleButtonList } from '@components/molecules/Toggle/ToggleButtonList';
import { DetailCard } from '@components/molecules/card/DetailCard';
import { P, H5, H2 } from '@components/atoms/Typhography/variants';
import { ButtonV1, StepperButton } from '@components/atoms/Button';
import { relativeHeight, relativeWidth } from '@core/util/Theme/layout';
import { StepProgress } from '@components/molecules/Progress';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardImage, ServiceCategoryAccordion } from '@components/molecules/card';
import { useNavigation } from '@react-navigation/native';
import AuthHeader from '@components/organisms/header/AuthHeader';
import { useToast } from '@core/util/ToastProvider';
import { RequestedEmployee, SelectedService, CreateProviderStepFour, CreateProviderData } from "@core/models"
import { connect } from 'react-redux';
import { Actions } from '@core/modules/Actions';

interface LinkedMember {
    id: string;
    name: string;
    subtitle: string;
    leftImage: CardImage;
    rightImage: CardImage;
    selected?: boolean;
}

type ServiceProviderMemberCountManageScreenProps = {
    createProviderInfo: CreateProviderData;
    createProviderAccount: (data: any) => void;
};

const ServiceProviderMemberCountManageScreen: React.FC<ServiceProviderMemberCountManageScreenProps> = ({ createProviderAccount, createProviderInfo }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [mode, setMode] = useState<'individual' | 'group'>('group');
    const [teamSize, setTeamSize] = useState(3);
    const [search, setSearch] = useState('');
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const navigation = useNavigation<any>();

    const bg = typeof theme.background02 === 'function' ? (theme.background02 as any)(100) : (theme.background02 || '#0f1720');

    useEffect(() => {
        const stepFourData = createProviderInfo?.stepFour;
        if (stepFourData) {
            setMode(stepFourData.mode || 'individual');
            setTeamSize(stepFourData.teamSize || 1);
            setSelectedServices(stepFourData.services || []);
            // todo populate linked members from createProviderInfo
        }
    }, [createProviderInfo]);

    const [linkedMembers, setLinkedMembers] = useState<LinkedMember[]>([
        {
            id: '1',
            name: 'Jane Doe',
            subtitle: 'jane.doe@example.com',
            selected: true,
            leftImage: { key: 'sa_check_light', onPress: () => console.log('Pressed Jane Doe') },
            rightImage: { iconName: 'close', onPress: () => removeLinkedMember('1') }
        },
        {
            id: '2',
            name: 'John Smith',
            subtitle: 'john.smith@vendor.com',
            selected: true,
            leftImage: { key: 'sa_check_dark', onPress: () => console.log('Pressed John Smith') },
            rightImage: { iconName: 'close', onPress: () => removeLinkedMember('2') }
        },
    ]);

    const categories = [
        { id: 'cat1', title: 'Hair Services', items: [{ id: 's1', label: 'Haircut' }, { id: 's2', label: 'Hair Coloring' }, { id: 's3', label: 'Styling' }] },
        { id: 'cat2', title: 'Spa & Wellness', items: [{ id: 's4', label: 'Massage' }, { id: 's5', label: 'Facial' }] },
        { id: 'cat3', title: 'Nails', items: [{ id: 's6', label: 'Manicure' }, { id: 's7', label: 'Pedicure' }] }
    ];

    const removeLinkedMember = (id: string) => {
        setLinkedMembers(prev => prev.filter(m => m.id !== id));
    };

    const toggleMemberSelection = (id: string) => {
        setLinkedMembers(prev =>
            prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m)
        );
    };

    const getSelectedMembersCount = () => {
        return linkedMembers.filter(m => m.selected).length;
    };

    const handleServiceSelect = (categoryId: string, items: { id: string; selected?: boolean }[]) => {
        const selectedIds = items.filter(it => it.selected).map(it => it.id);
        setSelectedServices(prev => {
            const existingIdx = prev.findIndex(s => s.categoryId === categoryId);
            if (existingIdx === -1) {
                return [...prev, { categoryId, selectedCategeory: selectedIds }];
            }
            const updated = [...prev];
            updated[existingIdx] = { categoryId, selectedCategeory: selectedIds };
            return updated;
        });
    };

    const onNext = () => {
        // Validate group mode
        if (mode === 'group') {
            const selectedCount = getSelectedMembersCount();
            if (selectedCount < teamSize) {
                showToast(
                    t('team_validation_error', {
                        required: teamSize,
                        selected: selectedCount,
                    }) || `You need to select ${teamSize} team members but only ${selectedCount} are selected.`,
                    { type: 'error' }, false
                );
                return;
            }
        }

        // Validate service selection
        if (selectedServices.length === 0) {
            showToast(
                t('service_selection_required') || 'Please select at least one service category and sub-service.',
                { type: 'error' }
            );
            return;
        }

        // Build data object
        const teamData = mode === 'group'
            ? {
                mode: 'group',
                teamSize: teamSize,
                requestEmployee: linkedMembers.filter(m => m.selected).map(m => ({ id: m.id, name: m.name })) as RequestedEmployee[],
                services: selectedServices
            }
            : {
                mode: 'individual',
                services: selectedServices,
                teamSize: 1,
                requestEmployee: [] as RequestedEmployee[],
            };

        createProviderAccount({
            ...createProviderInfo,
            stepFour: teamData as CreateProviderStepFour,
        });

        showToast(t('team_services_saved') || 'Team and services information saved', { type: 'success' });
        navigation.navigate('SignupScreenFive');
    };

    const selectedMembersCount = getSelectedMembersCount();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <AuthHeader
                        title={t('team_setup') || 'Team Setup'}
                        onBack={() => { }}
                    />
                    <View style={styles.headerRow}>
                        <StepProgress step={4} total={5} value={4} />
                    </View>
                    <View style={styles.titleRow}>
                        <H2 style={styles.labelTextAlignLeft} themeToken="text01">{t('team_and_services_title') || 'Team & Services'}</H2>
                    </View>

                    <View style={styles.toggleRow}>
                        <ToggleButtonList
                            options={[{ key: 'individual', label: t('individual') || 'Individual' }, { key: 'group', label: t('group_team') || 'Group / Team' }]}
                            selectedKey={mode}
                            onChange={(k) => setMode(k as any)}
                        />
                    </View>

                    {mode === 'group' && (
                        <>
                            <View style={styles.descriptionRow}>
                                <P style={styles.leftText} themeToken='text02'>{t('team_and_services_description') || "Set your team size, add members, and select services based on your team's capacity."}</P>
                            </View>

                            <View style={styles.sectionTitleRow}>
                                <P themeToken='text01' style={styles.sectionTitle}>{t('team_size') || 'Team Size'}</P>
                            </View>

                            <View style={styles.cardRow}>
                                <View style={[styles.teamCard, { backgroundColor: theme.background01(100) }]}>
                                    <View style={styles.teamCardLeft}>
                                        <P themeToken='text01' style={styles.teamCardTitle}>{t('required_users') || 'Required Users'}</P>
                                        <P themeToken='text02' style={styles.teamCardSubtitle}>{t('active_licenses_needed') || 'Active licenses needed'}</P>
                                    </View>
                                    <View style={[styles.teamCardRight, { backgroundColor: theme.background02(50) }]}>
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
                                </View>
                            </View>

                            <View style={styles.sectionTitleRow}>
                                <P themeToken='text01' style={styles.sectionTitle}>{t('link_team_members') || 'Link Team Members'}</P>
                            </View>

                            <View style={styles.searchRow}>
                                <View style={styles.searchInputWrap}>
                                    <SearchTextInput width={'100%'} placeholder={t('search_by_email_or_phone') || 'Search by email or phone'} value={search} onChangeText={setSearch} />
                                </View>
                                <ButtonV1 textStyle={styles.addBtnText} text={t('add') || 'Add'} onPress={() => { }} containerStyle={[styles.addBtn, styles.addBtnPrimary]} />
                            </View>

                            <View style={styles.linkedLabelRow}>
                                <H5 themeToken='text01'>{t('linked_members') || 'Linked Members'}</H5>
                                <View style={[styles.linkCount, { backgroundColor: theme.background01(100) }]}>
                                    <Icon color={theme.text01(100)} name="link" size={18} style={styles.linkCountIcon} />
                                    <P>{selectedMembersCount}/{teamSize} {t('linked')}</P>
                                </View>
                            </View>

                            <View style={styles.listRow}>
                                {linkedMembers.map(m => {
                                    const cardStyle: any[] = [styles.memberCard];
                                    if (m.selected) {
                                        cardStyle.push({
                                            borderLeftWidth: 4,
                                            borderLeftColor: theme.primary01(100)
                                        });
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={m.id}
                                            onPress={() => toggleMemberSelection(m.id)}
                                            activeOpacity={0.7}
                                        >
                                            <DetailCard
                                                title={m.name}
                                                subtitle={m.subtitle}
                                                leftImage={m.leftImage as any}
                                                rightImage={m.rightImage as any}
                                                style={cardStyle}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}

                                <TouchableOpacity style={styles.linkMoreCardWrap} activeOpacity={0.8} onPress={() => { }}>
                                    <View style={[styles.linkMoreCardInner, { borderColor: theme.negative(100) }]}>
                                        <View style={[styles.linkMoreIcon, { backgroundColor: theme.background01(100) }]}>
                                            <Icon name="person-add" size={20} color={theme.light} />
                                        </View>
                                        <H5 themeToken='text01'>{t('link_more_member') || 'Link 1 more member'}</H5>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    <>
                        <View style={styles.sectionTitleRow}>
                            <P themeToken='text01' style={styles.sectionTitle}>{t('service_selection') || 'Service Selection'}</P>
                        </View>

                        <View style={styles.descriptionRow}>
                            <P style={styles.leftText} themeToken='text02'>{t('individual_description') || 'Select the service categories and sub-services you provide.'}</P>
                        </View>

                        <View style={styles.listRow}>
                            {categories.map(cat => (
                                <ServiceCategoryAccordion
                                    key={cat.id}
                                    id={cat.id}
                                    title={cat.title}
                                    items={cat.items}
                                    onSelectionChange={handleServiceSelect}
                                />
                            ))}
                        </View>
                    </>

                    <View style={styles.footer}>
                        <ButtonV1 text={t('confirm_and_continue') || 'Confirm and Continue'} onPress={onNext} containerStyle={styles.confirmBtn} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    safeArea: { flex: 1 },
    container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
    headerRow: { marginBottom: 16 },
    toggleRow: { marginBottom: 12 },
    descriptionRow: { marginBottom: 16, textAlign: 'left' },
    sectionTitleRow: { marginTop: 12, marginBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '700', textAlign: 'left' },
    cardRow: { marginBottom: 12 },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    searchInputWrap: { flex: 1 },
    addBtn: { height: 44, borderRadius: 8, paddingHorizontal: 14 },
    linkedLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
    linkCount: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, flexDirection: 'row' },
    listRow: { marginBottom: 12 },
    linkMoreCardWrap: { marginTop: 12 },
    addBtnPrimary: { width: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 20 },
    linkCountIcon: { width: 18, height: 18, tintColor: '#4DA3FF' },
    footer: { marginTop: 20 },
    confirmBtn: { width: '100%', height: 56, borderRadius: 12 },
    teamCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, marginBottom: 12 },
    teamCardLeft: { flex: 1, paddingRight: 12 },
    teamCardTitle: { fontSize: 16, fontWeight: '700', textAlign: 'left' },
    teamCardSubtitle: { marginTop: 6, textAlign: 'left' },
    teamCardRight: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: relativeWidth(2), paddingVertical: relativeHeight(2), borderRadius: 10 },
    memberCard: { marginBottom: 12 },
    linkMoreCardInner: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' },
    linkMoreIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginRight: 12 },
    addBtnText: { fontSize: 12, fontWeight: '600' },
    progressRow: { marginBottom: 8 },
    titleRow: { marginBottom: 18 },
    leftText: { textAlign: 'left' },
    labelTextAlignLeft: { textAlign: 'left' },
});


export default connect(
    (state: any) => ({
        createProviderInfo: state.auth.get('createProviderInfo'),
    }),
    {
        createProviderAccount: Actions.auth.createProviderAccount
    }
)(ServiceProviderMemberCountManageScreen);
