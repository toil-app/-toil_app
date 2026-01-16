import React, { useState, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H3, H4, H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useNavigation } from '@react-navigation/native';
import { Calendar, CalendarEvent } from '@components/molecules';

const ServiceProviderMasterScheduleScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    // const navigation: any = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSchedule, setSelectedSchedule] = useState<CalendarEvent | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Calendar events for the week view
    const calendarEvents: CalendarEvent[] = [
        {
            id: '1',
            date: '2023-10-01',
            title: 'Event 1',
            startTime: '09:00 AM',
            endTime: '10:30 AM',
            duration: '1.5h',
            location: '',
            description: '',
            color: '#10B981',
            customer: 'Alice Smith',
            contact: '(555) 123-4567',
        },
        {
            id: '2',
            date: '2023-10-02',
            title: 'Event 2',
            startTime: '11:00 AM',
            endTime: '12:00 PM',
            duration: '1h',
            location: '',
            description: '',
            color: '#3B82F6',
            customer: 'Bob Johnson',
            contact: '(555) 987-6543',
        },
        {
            id: '3',
            date: '2023-10-03',
            title: 'Event 3',
            startTime: '14:00 PM',
            endTime: '15:00 PM',
            duration: '1h',
            location: '',
            description: '',
            color: '#F97316',
            customer: 'Charlie Davis',
            contact: '(555) 555-5555',
        },
        {
            id: '4',
            date: '2023-10-05',
            title: 'Event 4',
            startTime: '09:00 AM',
            endTime: '10:30 AM',
            duration: '1.5h',
            location: '',
            description: '',
            color: '#3B82F6',
            customer: 'Diana Prince',
            contact: '(555) 444-4444',
        },
        {
            id: '5',
            date: '2023-10-05',
            title: 'Event 5',
            startTime: '11:00 AM',
            endTime: '12:00 PM',
            duration: '1h',
            location: '',
            description: '',
            color: '#F97316',
            customer: 'Ethan Hunt',
            contact: '(555) 333-3333',
        },
    ];

    const handleSchedulePress = useCallback((item: CalendarEvent) => {
        setSelectedSchedule(item);
        setShowDetailsModal(true);
    }, [setSelectedSchedule, setShowDetailsModal]);


    const themed = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        card: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        assignedBadge: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
        teamBusyBadge: {
            backgroundColor: '#F97316',
        },
    });

    const renderScheduleItem = useCallback((item: CalendarEvent) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.scheduleItem, themed.card]}
                onPress={() => handleSchedulePress(item)}
            >
                <View style={styles.scheduleTimeColumn}>
                    <P themeToken="text01" themeShade={100} style={styles.scheduleTime}>
                        {item.startTime}
                    </P>
                </View>

                <View
                    style={[
                        styles.scheduleLeftBorder,
                        { backgroundColor: item.color },
                    ]}
                />

                <View style={styles.scheduleContent}>
                    <H5 themeToken="text01" themeShade={100} style={styles.scheduleTitle}>
                        {item.title}
                    </H5>
                    <P themeToken="text02" themeShade={75}>
                        {item.description}
                    </P>

                    <View style={styles.scheduleDetails}>
                        <Icon
                            name="clock-outline"
                            size={16}
                            color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                        />
                        <P themeToken="text02" themeShade={75} size={13}>
                            {item.startTime} - {item.endTime}
                        </P>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [handleSchedulePress, themed, theme]);

    return (
        <SafeAreaView style={themed.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft}>
                    <H3 themeToken="text01" themeShade={100}>
                        {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </H3>
                    <Icon
                        name="chevron-down"
                        size={20}
                        color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                    />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon
                            name="bell-outline"
                            size={24}
                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                        />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <Image
                        source={require('@assets/images/sa_initiate.png')}
                        style={styles.profileImage}
                    />
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Calendar Week View */}
                <Calendar
                    type='agenda'
                    events={calendarEvents}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    highlightColor={theme.primary01 ? theme.primary01(100) : '#3B82F6'}
                    showYearSelector={true}
                    showMonthSelector={true}
                    renderAgendaItem={renderScheduleItem}
                />

            </ScrollView>

            {/* Schedule Details Modal */}
            <Modal
                visible={showDetailsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, themed.container]}>
                        <View style={styles.modalHeader}>
                            <H4 themeToken="text01" themeShade={100}>
                                {selectedSchedule?.title}
                            </H4>
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                <Icon
                                    name="close"
                                    size={24}
                                    color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                                />
                            </TouchableOpacity>
                        </View>

                        <P themeToken="text02" themeShade={75} style={styles.modalSubtitle}>
                            Today, {selectedSchedule?.startTime} - {selectedSchedule?.endTime}
                        </P>

                        <ScrollView
                            style={styles.modalScroll}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Customer Info */}
                            {selectedSchedule?.customer && (
                                <View style={styles.infoSection}>
                                    <View style={[styles.infoCard, themed.card]}>
                                        <Icon
                                            name="account-outline"
                                            size={20}
                                            color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                                        />
                                        <View style={styles.infoContent}>
                                            <P themeToken="text02" themeShade={75} size={12}>
                                                {t('customer').toUpperCase()}
                                            </P>
                                            <H5 themeToken="text01" themeShade={100}>
                                                {selectedSchedule.customer}
                                            </H5>
                                        </View>
                                    </View>

                                    <View style={[styles.infoCard, themed.card]}>
                                        <Icon
                                            name="phone-outline"
                                            size={20}
                                            color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                                        />
                                        <View style={styles.infoContent}>
                                            <P themeToken="text02" themeShade={75} size={12}>
                                                {t('contact').toUpperCase()}
                                            </P>
                                            <H5
                                                themeToken="text01"
                                                themeShade={100}
                                                style={styles.contactText}
                                            >
                                                {selectedSchedule.contact}
                                            </H5>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Location */}
                            {selectedSchedule?.location && (
                                <View style={styles.locationSection}>
                                    <P themeToken="text02" themeShade={75} size={12} style={styles.sectionLabel}>
                                        {t('location').toUpperCase()}
                                    </P>

                                    <View style={[styles.mapContainer, themed.card]}>
                                        <View style={styles.mapPlaceholder}>
                                            <Icon name="map-marker" size={48} color="#FF0000" />
                                        </View>
                                    </View>

                                    <TouchableOpacity style={styles.directionsButton}>
                                        <Icon
                                            name="navigation"
                                            size={20}
                                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                                        />
                                        <P themeToken="text01" themeShade={100} style={styles.directionsText}>
                                            {t('get_directions')}
                                        </P>
                                    </TouchableOpacity>

                                    <P themeToken="text01" themeShade={100} style={styles.addressText}>
                                        {selectedSchedule.location}
                                    </P>
                                </View>
                            )}
                        </ScrollView>

                        {/* Mark Complete Button */}
                        <TouchableOpacity
                            style={[styles.completeButton, themed.assignedBadge]}
                            onPress={() => setShowDetailsModal(false)}
                        >
                            <Icon name="check-circle" size={20} color="#FFFFFF" />
                            <P style={styles.completeButtonText}>{t('mark_complete')}</P>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    scheduleSection: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    scheduleSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    scheduleList: {
        gap: 12,
    },
    scheduleItem: {
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        gap: 12,
        marginBottom: 8,
    },
    scheduleTimeColumn: {
        alignItems: 'center',
        marginRight: 16,
        minWidth: 50,
    },
    scheduleTime: {
        fontSize: 18,
        fontWeight: '700',
    },
    scheduleLeftBorder: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    scheduleContent: {
        flex: 1,
        gap: 8,
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    scheduleTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    scheduleDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamMembersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    teamMemberAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#6B7280',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1E2936',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    modalScroll: {
        marginBottom: 16,
    },
    infoSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },
    contactText: {
        fontSize: 14,
    },
    locationSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        marginBottom: 12,
        fontWeight: '600',
    },
    mapContainer: {
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
    },
    directionsButton: {
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: [{ translateX: -75 }],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
    },
    directionsText: {
        fontSize: 14,
        fontWeight: '600',
    },
    addressText: {
        fontSize: 16,
        textAlign: 'left',
    },
    completeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
});

export default ServiceProviderMasterScheduleScreen;
