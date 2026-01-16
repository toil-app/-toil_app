import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { H3, H4, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatCard } from '@components/molecules/card/StatCard';
import { RatingCard } from '@components/molecules/card/RatingCard';
import { EarningsCard } from '@components/molecules/card/EarningsCard';
import { QuickActionCard } from '@components/molecules/card/QuickActionCard';
import { ActiveServiceCard } from '@components/molecules/card/ActiveServiceCard';
import { AlertCard } from '@components/molecules/card/AlertCard';
import { relativeHeight } from '@core/util/Theme/layout';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation: any = useNavigation();

    // Sample state for active services
    const [services, setServices] = useState([
        {
            id: 1,
            title: 'Deep Home Cleaning',
            price: '$80/hr',
            bookings: 25,
            isActive: true,
            image: require('@assets/images/sa_initiate.png'),
        },
        {
            id: 2,
            title: 'Pipe Repair',
            price: '$120/job',
            bookings: 12,
            isActive: true,
            image: require('@assets/images/sa_initiate.png'),
        },
    ]);

    const quickActionsData = [
        {
            id: 'manage_services',
            icon: 'briefcase-outline',
            iconColor: '#3B82F6',
            label: t('manage_services'),
        },
        {
            id: 'view_payouts',
            icon: 'cash-multiple',
            iconColor: '#8B5CF6',
            label: t('view_payouts'),
        },
        {
            id: 'my_portfolio',
            icon: 'image-multiple',
            iconColor: '#EC4899',
            label: t('my_portfolio'),
        },
    ];

    const bookingsData = [
        {
            id: 'pending',
            icon: 'clock-outline',
            iconColor: '#F59E0B',
            value: '3',
            label: t('pending'),
            subtitle: t('requires_action'),
        },
        {
            id: 'assigned',
            icon: 'calendar-check',
            iconColor: '#3B82F6',
            value: '8',
            label: t('assigned'),
            subtitle: t('upcoming_jobs'),
        },
        {
            id: 'ongoing',
            icon: 'play-circle',
            iconColor: '#10B981',
            value: '1',
            label: t('ongoing'),
            subtitle: t('active_now'),
        },
        {
            id: 'completed',
            icon: 'check-circle',
            iconColor: '#6B7280',
            value: '142',
            label: t('completed'),
            subtitle: t('total_history'),
        },
    ];

    const themed = StyleSheet.create({
        container: {
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
    });

    const handleServiceToggle = (id: number, value: boolean) => {
        setServices((prev) =>
            prev.map((service) =>
                service.id === id ? { ...service, isActive: value } : service
            )
        );
    };

    const renderItemSeparator = () => <View style={styles.itemSeparator} />;

    return (
        <SafeAreaView style={[styles.safe, themed.container]} edges={['top']}>
            <ScrollView
                style={[styles.container, themed.container]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.menuButton}>
                        <Icon
                            name="menu"
                            size={28}
                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                    <H3 themeToken="text01" style={styles.headerTitle}>
                        {t('dashboard')}
                    </H3>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('TeamScreen')}
                        style={styles.avatarContainer}>
                        <Image
                            source={require('@assets/images/sa_initiate.png')}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Overall Rating Card */}
                <RatingCard
                    title={t('overall_rating')}
                    rating={4.9}
                    maxRating={5.0}
                    totalReviews={128}
                    style={styles.ratingCard}
                />

                {/* Bookings Overview */}
                <View style={styles.section}>
                    <H4 themeToken="text01" style={styles.sectionTitle}>
                        {t('bookings_overview')}
                    </H4>
                    <FlatList
                        data={bookingsData}
                        numColumns={2}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id}
                        columnWrapperStyle={styles.grid}
                        renderItem={({ item }) => (
                            <StatCard
                                icon={item.icon}
                                iconColor={item.iconColor}
                                value={item.value}
                                label={item.label}
                                subtitle={item.subtitle}
                                onPress={() => { }}
                                style={styles.statCard}
                            />
                        )}
                    />
                </View>

                {/* Earnings Overview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <H4 themeToken="text01" style={styles.sectionTitle}>
                            {t('earnings_overview')}
                        </H4>
                        <TouchableOpacity style={styles.dropdownButton}>
                            <P themeShade={75} style={styles.dropdownText}>
                                {t('this_week')}
                            </P>
                            <Icon
                                name="chevron-down"
                                size={18}
                                color={theme.text02 ? theme.text02(80) : '#9CA3AF'}
                            />
                        </TouchableOpacity>
                    </View>
                    <EarningsCard
                        amount={842.0}
                        percentage={12.5}
                        period={t('this_week')}
                        style={styles.earningsCard}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <H4 themeToken="text01" style={styles.sectionTitle}>
                        {t('quick_actions')}
                    </H4>
                    <FlatList
                        data={quickActionsData}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={renderItemSeparator}
                        renderItem={({ item }) => (
                            <QuickActionCard
                                icon={item.icon}
                                iconColor={item.iconColor}
                                label={item.label}
                                onPress={() => { }}
                                style={styles.actionCard}
                            />
                        )}
                    />
                </View>

                {/* Active Services */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <H4 themeToken="text01" style={styles.sectionTitle}>
                            {t('active_services')}
                        </H4>
                        <TouchableOpacity>
                            <P
                                themeShade={100}
                                style={styles.viewAllText}
                            >
                                {t('view_all')}
                            </P>
                        </TouchableOpacity>
                    </View>
                    {services.map((service) => (
                        <ActiveServiceCard
                            key={service.id}
                            image={service.image}
                            title={service.title}
                            price={service.price}
                            bookings={service.bookings}
                            isActive={service.isActive}
                            onToggle={(value) => handleServiceToggle(service.id, value)}
                        />
                    ))}
                </View>

                {/* Latest Alerts */}
                <View style={styles.section}>
                    <H4 themeToken="text01" style={styles.sectionTitle}>
                        {t('latest_alerts')}
                    </H4>
                    <AlertCard
                        type="error"
                        title={t('new_booking_request')}
                        message={t('new_booking_request_message')}
                        timestamp={t('mins_ago', { count: 10 })}
                        onPress={() => { }}
                    />
                    <AlertCard
                        type="info"
                        title={t('weekly_payout_processed')}
                        message={t('weekly_payout_processed_message')}
                        timestamp={t('hours_ago', { count: 2 })}
                        onPress={() => { }}
                    />
                </View>

                {/* Bottom spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
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
    content: {
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    ratingCard: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sectionTitle: {
        fontWeight: '600',
        textAlign: 'left',
        marginBottom: relativeHeight(12),
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    dropdownText: {
        fontSize: 14,
        marginRight: 4,
    },
    grid: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    statCard: {
        marginRight: 12,
    },
    earningsCard: {
        marginBottom: 0,
    },
    quickActions: {
        flexDirection: 'row',
    },
    actionCard: {
        flex: 1,
    },
    itemSeparator: {
        width: 12,
    },
    viewAllText: {
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 24,
    },
});

export default DashboardScreen;
