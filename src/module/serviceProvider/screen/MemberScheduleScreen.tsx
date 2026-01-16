import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H5, P } from '@components/atoms';
import { Progressbar } from '@components/atoms/Progressbar/Progressbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthHeader } from '@components/organisms/header';
import Calendar, { CalendarEvent } from '@components/molecules/calendar/Calendar';

interface EventData extends CalendarEvent { }

interface MemberScheduleScreenProps {
    memberId?: string;
    memberName?: string;
    memberRole?: string;
    memberAvatar?: any;
    weeklyCapacity?: string;
    bookedHours?: number;
    totalHours?: number;
}

const MemberScheduleScreen: React.FC<MemberScheduleScreenProps> = ({
    memberName = 'Jane Doe',
    memberRole = 'HVAC Technician',
    memberAvatar = require('@assets/images/avatar-placeholder.png'),
    weeklyCapacity = '32/40 hrs',
    bookedHours = 32,
    totalHours = 40,
}) => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    // const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // All events data for all months
    const allEventsData: EventData[] = [
        // January 2026
        {
            id: '1',
            date: '2026-01-05',
            title: 'AC Unit Repair',
            startTime: '09:00',
            endTime: '10:30',
            duration: '1h 30m',
            location: '123 Main St',
            description: 'Mike Ross • Residential',
            color: '#3B82F6',
            status: 'in_progress',
        },
        {
            id: '2',
            date: '2026-01-05',
            title: 'System Consultation',
            startTime: '11:00',
            endTime: '12:00',
            duration: '1h 00m',
            location: '500 Madison Ave',
            description: 'Pearson Specter Office',
            color: '#10B981',
            status: 'assigned',
        },
        {
            id: '3',
            date: '2026-01-06',
            title: 'Check-out',
            startTime: '17:30',
            endTime: '18:00',
            duration: '30m',
            location: 'HQ',
            description: 'Inventory Return',
            color: '#EF4444',
            status: 'scheduled',
        },
        {
            id: '4',
            date: '2026-01-10',
            title: 'Equipment Testing',
            startTime: '08:00',
            endTime: '10:00',
            duration: '2h',
            location: 'Service Center',
            description: 'Field Equipment Check',
            color: '#3B82F6',
            status: 'scheduled',
        },
        {
            id: '5',
            date: '2026-01-12',
            title: 'Client Meeting',
            startTime: '14:00',
            endTime: '15:00',
            duration: '1h',
            location: 'Office',
            description: 'Quarterly Review',
            color: '#10B981',
            status: 'scheduled',
        },
        // February 2026
        {
            id: '6',
            date: '2026-02-02',
            title: 'Maintenance Check',
            startTime: '09:00',
            endTime: '11:00',
            duration: '2h',
            location: '789 Oak Ave',
            description: 'Monthly Maintenance',
            color: '#3B82F6',
            status: 'scheduled',
        },
        // Multi-day event: Project spanning Jan 25 - Feb 20
        {
            id: '11',
            startDate: '2026-01-25',
            endDate: '2026-02-20',
            title: 'Major Installation Project',
            startTime: '08:00',
            endTime: '17:00',
            duration: '27 days',
            location: 'Project Site A',
            description: 'Large-scale HVAC Installation • Multiple Phases',
            color: '#8B5CF6',
            status: 'in_progress',
        },
        // Single day event within the project period
        {
            id: '7',
            date: '2026-02-08',
            title: 'Installation Work',
            startTime: '10:00',
            endTime: '12:30',
            duration: '2h 30m',
            location: '456 Elm Street',
            description: 'New System Installation',
            color: '#10B981',
            status: 'in_progress',
        },
        // Another multi-day event spanning Feb 10-12
        {
            id: '12',
            startDate: '2026-02-10',
            endDate: '2026-02-12',
            title: 'Advanced HVAC Training',
            startTime: '09:00',
            endTime: '17:00',
            duration: '3 days',
            location: 'Training Center',
            description: 'Certification Program • All Day Event',
            color: '#F59E0B',
            status: 'scheduled',
        },
        {
            id: '8',
            date: '2026-02-15',
            title: 'Emergency Repair',
            startTime: '13:00',
            endTime: '14:00',
            duration: '1h',
            location: '321 Pine Rd',
            description: 'Urgent Customer Call',
            color: '#EF4444',
            status: 'in_progress',
        },
        // December 2025
        {
            id: '9',
            date: '2025-12-14',
            title: 'System Check',
            startTime: '09:00',
            endTime: '11:00',
            duration: '2h',
            location: 'Main Office',
            description: 'Quarterly System Review',
            color: '#3bf66dff',
            status: 'scheduled',
        },
        {
            id: '10',
            date: '2025-12-20',
            title: 'Inspection & Certification',
            startTime: '10:00',
            endTime: '12:00',
            duration: '2h',
            location: 'Downtown Location',
            description: 'Safety Inspection',
            color: '#b910abff',
            status: 'scheduled',
        },
        {
            id: '20',
            date: '2026-02-18',
            title: 'Installation Work',
            startTime: '10:00',
            endTime: '12:30',
            duration: '2h 30m',
            location: '456 Elm Street',
            description: 'New System Installation',
            color: '#10B981',
            status: 'in_progress',
        },
    ];

    // Custom render function for agenda items
    const renderCustomAgendaItem = (event: CalendarEvent, _index: number) => (
        <TouchableOpacity
            style={[
                styles.customAgendaItem,
                { borderLeftColor: event.color },
            ]}
        >
            <View style={styles.eventTimeSection}>
                <P style={styles.eventTime} themeToken="text02" themeShade={75}>
                    {event.startTime}
                </P>
                <P style={styles.eventDuration} themeToken="text02" themeShade={50}>
                    {event.duration}
                </P>
            </View>

            <View style={styles.eventDetailsSection}>
                <P style={styles.eventTitle} themeToken="text01" themeShade={100}>
                    {event.title}
                </P>
                <P style={styles.eventDescription} themeToken="text02" themeShade={75}>
                    {event.description}
                </P>
                <View style={styles.eventMetaContainer}>
                    <View style={styles.eventMeta}>
                        <Icon
                            name="clock-outline"
                            size={14}
                            color={theme.text02 ? theme.text01(50) : '#9CA3AF'}
                        />
                        <P
                            style={styles.eventMetaText}
                            themeToken="text02"
                            themeShade={50}
                        >
                            {event.startTime} - {event.endTime}
                        </P>
                    </View>
                    <View style={styles.eventMeta}>
                        <Icon
                            name="map-marker-outline"
                            size={14}
                            color={theme.text02 ? theme.text01(50) : '#9CA3AF'}
                        />
                        <P
                            style={styles.eventMetaText}
                            themeToken="text01"
                            themeShade={50}
                        >
                            {event.location}
                        </P>
                    </View>
                </View>
            </View>

            <Icon
                name="chevron-right"
                size={20}
                color={theme.text02 ? theme.text01(50) : '#9CA3AF'}
            />
        </TouchableOpacity>
    );

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        memberCard: {
            backgroundColor: theme.background02 ? theme.background02(75) : '#1E2936',
        },
        tabButton: {
            borderBottomColor: '#3B82F6',
        },
        fab: {
            backgroundColor: '#3B82F6',
        },
    });

    return (
        <SafeAreaView style={[styles.safe, themed.container]}>
            <View style={[styles.container, themed.container]}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <AuthHeader
                        title={t('schedule')}
                        onBack={() => { }}
                    />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Member Info Card */}
                    <View style={[styles.memberCard, themed.memberCard]}>
                        <View style={styles.memberHeader}>
                            <Image
                                source={memberAvatar}
                                style={styles.avatar}
                            />
                            <View style={styles.memberInfo}>
                                <H5 style={[styles.memberName, styles.textAlignLeft]}>{memberName}</H5>
                                <P style={styles.textAlignLeft} themeToken="text01" themeShade={50}>
                                    {memberRole}
                                </P>
                            </View>
                        </View>

                        {/* Capacity */}
                        <View style={styles.capacitySection}>
                            <View style={styles.capacityHeader}>
                                <H5 style={styles.capacityLabel}>{t('weekly_capacity')}</H5>
                                <P style={styles.capacityValue} themeToken="text02" themeShade={75}>
                                    {weeklyCapacity} <P themeToken="text02" themeShade={50}>booked</P>
                                </P>
                            </View>
                            <Progressbar
                                value={bookedHours}
                                max={totalHours}
                                height={8}
                                showLabel={false}
                            />
                        </View>
                    </View>

                    {/* View Mode Tabs */}
                    {/* <View style={styles.tabsContainer}>
                        {(['day', 'week', 'month'] as const).map((mode) => (
                            <TouchableOpacity
                                key={mode}
                                style={[
                                    styles.tab,
                                    viewMode === mode && [styles.activeTab, themed.tabButton],
                                ]}
                                onPress={() => setViewMode(mode)}
                            >
                                <P
                                    style={[
                                        styles.tabLabel,
                                        viewMode === mode ? styles.tabLabelActive : styles.tabLabelInactive,
                                    ]}
                                    themeToken={viewMode === mode ? 'text01' : 'text02'}
                                    themeShade={viewMode === mode ? 100 : 75}
                                >
                                    {t(mode)}
                                </P>
                            </TouchableOpacity>
                        ))}
                    </View> */}

                    {/* Reusable Calendar Component */}
                    <Calendar
                        type="calendar"
                        events={allEventsData}
                        selectedDate={selectedDate}
                        onDateSelect={(date) => setSelectedDate(date)}
                        highlightColor="#3B82F6"
                        renderAgendaItem={renderCustomAgendaItem}
                        showYearSelector={true}
                        showMonthSelector={true}
                    />
                </ScrollView>

                {/* FAB */}
                <TouchableOpacity style={[styles.fab, themed.fab]}>
                    <Icon name="plus" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    memberCard: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 12,
        padding: 16,
    },
    memberHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    capacitySection: {
        gap: 8,
    },
    capacityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    capacityLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    capacityValue: {
        fontSize: 14,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 20,
        gap: 32,
    },
    tab: {
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabLabel: {
        fontSize: 14,
    },
    tabLabelActive: {
        fontWeight: '600',
    },
    tabLabelInactive: {
        fontWeight: '400',
    },
    customAgendaItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        // paddingHorizontal: 12,
        // paddingVertical: 12,
        // borderRadius: 8,
        // borderLeftWidth: 4,
        // gap: 12,
        // marginBottom: 8,
    },
    eventTimeSection: {
        minWidth: 50,
        alignItems: 'flex-start',
    },
    eventTime: {
        fontSize: 13,
        fontWeight: '600',
    },
    eventDuration: {
        fontSize: 11,
        marginTop: 2,
    },
    eventDetailsSection: {
        flex: 1,
        gap: 6,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    eventDescription: {
        fontSize: 12,
    },
    eventMetaContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
        flexWrap: 'wrap',
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    eventMetaText: {
        fontSize: 11,
    },
    fab: {
        position: 'absolute',
        bottom: 60,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    textAlignLeft: {
        textAlign: 'left',
    },
});

export default MemberScheduleScreen;
