import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H1, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { BookingCard, ButtonListV2 } from '@components/molecules';

type BookingStatus = 'needs_confirmation' | 'team_assigned' | 'scheduled' | 'unassigned';

interface TeamMember {
    id: string;
    avatar: any;
    name: string;
}

interface Booking {
    id: string;
    title: string;
    subtitle: string;
    time: string;
    icon: any;
    status: BookingStatus;
    statusLabel: string;
    actionLabel?: string;
    teamMembers?: TeamMember[];
    teamCount?: string;
}

interface BookingsByDate {
    date: string;
    dateLabel: string;
    bookings: Booking[];
}

const ServiceProviderAppointmentScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation: any = useNavigation();

    const [selectedTab, setSelectedTab] = useState<string>('assigned');

    // Sample bookings data
    const bookingsData: BookingsByDate[] = [
        {
            date: '2024-10-24',
            dateLabel: t('today_date', { date: 'OCT 24' }),
            bookings: [
                {
                    id: '1',
                    title: t('emergency_pipe_repair'),
                    subtitle: 'John Doe',
                    time: '2:00 PM - 3:30 PM',
                    icon: require('@assets/images/sa_initiate.png'),
                    status: 'needs_confirmation',
                    statusLabel: t('needs_confirmation'),
                    actionLabel: t('view_details'),
                },
                {
                    id: '2',
                    title: t('deep_clean_office'),
                    subtitle: 'Tech Solutions Inc.',
                    time: '09:00 AM - 12:00 PM',
                    icon: require('@assets/images/sa_initiate.png'),
                    status: 'team_assigned',
                    statusLabel: t('team_assigned_count', { current: 2, total: 3 }),
                    teamMembers: [
                        { id: 't1', avatar: require('@assets/images/sa_initiate.png'), name: 'Member 1' },
                        { id: 't2', avatar: require('@assets/images/sa_initiate.png'), name: 'Member 2' },
                    ],
                    teamCount: '+',
                },
            ],
        },
        {
            date: '2024-10-25',
            dateLabel: t('tomorrow_date', { date: 'OCT 25' }),
            bookings: [
                {
                    id: '3',
                    title: t('electrical_inspection'),
                    subtitle: 'Modern Living Apts',
                    time: '10:00 AM (2h est.)',
                    icon: require('@assets/images/sa_initiate.png'),
                    status: 'scheduled',
                    statusLabel: t('scheduled'),
                    actionLabel: t('add_team'),
                },
                {
                    id: '4',
                    title: t('lawn_mowing'),
                    subtitle: 'Alice Smith',
                    time: '3:00 PM - 4:00 PM',
                    icon: require('@assets/images/sa_initiate.png'),
                    status: 'unassigned',
                    statusLabel: t('unassigned'),
                },
            ],
        },
    ];

    const tabs = [
        { id: 'new_requests', key: 'new_requests' as const, label: t('new_requests'), count: 2 },
        { id: 'assigned', key: 'assigned' as const, label: t('assigned'), count: 4 },
        { id: 'pending', key: 'pending' as const, label: t('pending'), count: 0 },
        { id: 'completed', key: 'completed' as const, label: t('completed'), count: 0 },
    ];

    const themed = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        header: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        searchButton: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        fab: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    return (
        <SafeAreaView style={themed.container} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, themed.header]}>
                <H1 themeToken="text01" themeShade={100} style={styles.headerTitle}>
                    {t('my_bookings')}
                </H1>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={[styles.iconButton, themed.searchButton]}>
                        <Icon
                            name="magnify"
                            size={24}
                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.avatar}>
                        <Image
                            source={require('@assets/images/sa_initiate.png')}
                            style={styles.avatarImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <ButtonListV2
                tabs={tabs}
                selectedTab={selectedTab}
                onTabSelect={setSelectedTab}
                horizontal={true}
                showBadge={true}
                paddingHorizontal={20}
            />

            {/* Bookings List */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {bookingsData.map((section) => (
                    <View key={section.date} style={styles.section}>
                        <P
                            themeToken="text02"
                            themeShade={100}
                            size={13}
                            style={styles.sectionTitle}
                        >
                            {section.dateLabel}
                        </P>
                        {section.bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onPress={() => navigation.navigate('ServiceProviderAppointmentViewScreen', { bookingId: booking.id })}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity style={[styles.fab, themed.fab]}>
                <Icon name="plus" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        paddingHorizontal: 20,
        marginBottom: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});

export default ServiceProviderAppointmentScreen;
