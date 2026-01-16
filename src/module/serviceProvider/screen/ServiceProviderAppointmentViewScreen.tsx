import React from 'react';
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
import { H1, H4, H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { AuthHeader } from '@components/organisms/header';
import { ScheduleCard } from '@components/molecules';

const ServiceProviderAppointmentViewScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const navigation: any = useNavigation();

    const themed = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background02 ? theme.background02(100) : '#0B1220',
        },
        card: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        statusBadge: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
        infoCard: {
            backgroundColor: theme.background01 ? theme.background01(75) : '#2D3748',
        },
        rejectButton: {
            backgroundColor: 'transparent',
            borderColor: theme.text02 ? theme.text02(50) : '#6B7280',
        },
        acceptButton: {
            backgroundColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    return (
        <SafeAreaView style={themed.container} edges={['top', 'bottom']}>
            {/* Header */}
            <AuthHeader
                title={t('request_details')}
                onBack={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity style={styles.headerButton}>
                        <Icon
                            name="dots-vertical"
                            size={24}
                            color={theme.text01 ? theme.text01(100) : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Status Badge */}
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, themed.statusBadge]}>
                        <View style={styles.statusDot} />
                        <P style={styles.statusText}>{t('new_request')}</P>
                    </View>
                    <P themeToken="text02" themeShade={75} style={styles.requestId}>
                        #BK-2023-889
                    </P>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <H1 themeToken="text01" themeShade={100} style={styles.title}>
                        {t('deep_cleaning_service')}
                    </H1>
                    <P themeToken="text02" themeShade={75} style={styles.subtitle}>
                        {t('review_details_before_accepting')}
                    </P>
                </View>

                {/* Customer Card */}
                <View style={[styles.customerCard, themed.card]}>
                    <View style={styles.customerInfo}>
                        <Image
                            source={require('@assets/images/sa_initiate.png')}
                            style={styles.avatar}
                        />
                        <View style={styles.customerDetails}>
                            <H5 style={{ textAlign: 'left' }} themeToken="text01" themeShade={100}>
                                Sarah Jenkins
                            </H5>
                            <View style={styles.ratingRow}>
                                <Icon name="star" size={16} color="#FFA500" />
                                <P themeToken="text02" themeShade={75} size={14}>
                                    {' '}4.9 ({t('reviews_count', { count: 12 })})
                                </P>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.messageButton}>
                        <Icon
                            name="message-text"
                            size={24}
                            color={theme.text01 ? theme.text01(100) : '#3B82F6'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Map Placeholder */}
                <View style={[styles.mapContainer, themed.card]}>
                    <View style={styles.mapPlaceholder}>
                        <Icon name="map-marker" size={48} color="#FF0000" />
                    </View>
                </View>

                {/* Service Location */}
                <View style={[styles.locationCard, themed.card]}>
                    <View style={styles.locationHeader}>
                        <Icon
                            name="map-marker-outline"
                            size={20}
                            color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                        />
                        <P themeToken="text01" themeShade={75} style={styles.locationLabel}>
                            {t('service_location').toUpperCase()}
                        </P>
                    </View>
                    <H5 themeToken="text01" themeShade={100} style={styles.locationAddress}>
                        123 Main St, Springfield, IL
                    </H5>
                    <P textAlign="left" themeToken="text01" themeShade={75} size={14}>
                        {t('approx_distance', { distance: '5.2 km' })}
                    </P>
                </View>

                {/* Schedule & Requirements */}
                <View style={styles.sectionContainer}>
                    <H4 themeToken="text01" themeShade={100} style={styles.sectionTitle}>
                        {t('schedule_requirements')}
                    </H4>

                    <View style={styles.scheduleGrid}>
                        {[
                            {
                                iconName: 'calendar-start',
                                label: t('start'),
                                value: 'Oct 24, 2023',
                                subtitle: '10:00 AM',
                                labelThemeToken: 'text01' as const,
                                subtitleThemeToken: 'text01' as const,
                            },
                            {
                                iconName: 'calendar-end',
                                label: t('end'),
                                value: 'Oct 25, 2023',
                                subtitle: '06:00 PM',
                                labelThemeToken: 'text01' as const,
                                subtitleThemeToken: 'text01' as const,
                            },
                            {
                                iconName: 'clock-outline',
                                label: t('duration'),
                                value: t('days_count', { count: 2 }),
                                subtitle: t('hours_per_day', { hours: 8 }),
                                labelThemeToken: 'text01' as const,
                                subtitleThemeToken: 'text01' as const,
                            },
                            {
                                iconName: 'account-group',
                                label: t('staff_required'),
                                value: t('members_count', { count: 4 }),
                                subtitle: t('mandatory'),
                                labelThemeToken: 'text01' as const,
                                subtitleThemeToken: 'text01' as const,
                            },
                        ].map((item, index) => (
                            <ScheduleCard
                                key={index}
                                iconName={item.iconName}
                                label={item.label}
                                value={item.value}
                                subtitle={item.subtitle}
                                labelThemeToken={item.labelThemeToken}
                                subtitleThemeToken={item.subtitleThemeToken}
                                cardStyle={themed.infoCard}
                            />
                        ))}
                    </View>
                </View>

                {/* Pricing Info */}
                <View style={[styles.pricingCard, themed.infoCard]}>
                    <P textAlign='left' themeToken="text02" themeShade={75} size={14}>
                        {t('basis')}: <P textAlign='left' themeToken="text01" themeShade={100}>${t('price_per_hour_member', { price: 20 })}</P>
                    </P>
                    <P textAlign='left' themeToken="text02" themeShade={75} size={14}>
                        {t('total_hours')}: <P textAlign='left' themeToken="text01" themeShade={100}>{t('hours_collective', { hours: 32 })}</P>
                    </P>
                </View>

                {/* Customer Notes */}
                <View style={styles.sectionContainer}>
                    <H4 size={18} themeToken="text01" themeShade={100} style={styles.sectionTitle}>
                        {t('customer_notes')}
                    </H4>
                    <View style={[styles.notesCard, themed.card]}>
                        <Icon
                            name="format-quote-open"
                            size={24}
                            color={theme.text02 ? theme.text02(50) : '#6B7280'}
                            style={styles.quoteIcon}
                        />
                        <P size={18} numberOfLines={10} themeToken="text02" themeShade={75} style={styles.notesText}>
                            Please ensure all team members bring their own eco-friendly cleaning supplies as requested. The back gate code is 4590.
                        </P>
                    </View>
                </View>
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={[styles.rejectButton, themed.rejectButton]}>
                        <P themeToken="text01" themeShade={100} style={styles.buttonText}>
                            {t('reject')}
                        </P>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.acceptButton, themed.acceptButton]}>
                        <Icon name="check-circle" size={20} color="#FFFFFF" />
                        <P style={styles.acceptButtonText}>{t('accept_request')}</P>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Action Buttons */}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'left',
    },
    requestId: {
        fontSize: 14,
        textAlign: 'left',
    },
    titleSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'left',
    },
    customerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    customerDetails: {
        gap: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
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
    locationCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 8,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationLabel: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textAlign: 'left',
    },
    locationAddress: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'left',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'left',
    },
    scheduleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pricingCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
    },
    notesCard: {
        padding: 16,
        borderRadius: 12,
        position: 'relative',
        flexDirection: 'row'
    },
    quoteIcon: {
        marginBottom: 8,
    },
    notesText: {
        lineHeight: 22,
        textAlign: 'left',
    },
    actionContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        marginBottom: 100
    },
    rejectButton: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'left',
    },
    acceptButton: {
        flex: 2,
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'left',
    },
});

export default ServiceProviderAppointmentViewScreen;
