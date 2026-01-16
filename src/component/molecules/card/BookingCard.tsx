import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTranslation } from 'react-i18next';

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

interface BookingCardProps {
    booking: Booking;
    onPress?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress = () => { } }) => {
    const theme: any = useTheme();
    // const { t } = useTranslation();

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'needs_confirmation':
                return {
                    bg: 'rgba(245, 158, 11, 0.15)',
                    text: theme.warning ? theme.warning(100) : '#F59E0B',
                    border: 'rgba(245, 158, 11, 0.3)',
                };
            case 'team_assigned':
                return {
                    bg: 'rgba(16, 185, 129, 0.15)',
                    text: theme.positive ? theme.positive(100) : '#10B981',
                    border: 'rgba(16, 185, 129, 0.3)',
                };
            case 'scheduled':
                return {
                    bg: 'rgba(59, 130, 246, 0.15)',
                    text: theme.primary01 ? theme.light : '#3B82F6',
                    border: 'rgba(59, 130, 246, 0.3)',
                };
            case 'unassigned':
                return {
                    bg: 'rgba(107, 114, 128, 0.15)',
                    text: theme.text02 ? theme.text01(50) : '#9CA3AF',
                    border: 'rgba(107, 114, 128, 0.3)',
                };
            default:
                return {
                    bg: 'rgba(107, 114, 128, 0.15)',
                    text: '#9CA3AF',
                    border: 'rgba(107, 114, 128, 0.3)',
                };
        }
    };

    const statusColors = getStatusColor(booking.status);

    const themed = StyleSheet.create({
        card: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
        statusBadge: {
            backgroundColor: statusColors.bg,
            borderColor: statusColors.border,
        },
        actionButton: {
            color: theme.primary01 ? theme.primary01(100) : '#3B82F6',
        },
    });

    return (
        <View style={[styles.card, themed.card]}>
            <TouchableOpacity onPress={onPress} style={styles.cardContent} activeOpacity={0.7}>
                {/* Icon/Image */}
                <View style={styles.iconContainer}>
                    <Image source={booking.icon} style={styles.icon} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <View style={styles.textContent}>
                            <H5 themeToken="text01" themeShade={100} size={16} style={styles.title}>
                                {booking.title}
                            </H5>
                            <P themeToken="text02" themeShade={75} size={14} style={styles.subtitle}>
                                {booking.subtitle}
                            </P>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={24}
                            color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                        />
                    </View>

                    {/* Time */}
                    <View style={styles.timeRow}>
                        <Icon
                            name="clock-outline"
                            size={16}
                            color={theme.text02 ? theme.text02(75) : '#9CA3AF'}
                        />
                        <P themeToken="text02" themeShade={75} size={14}>
                            {booking.time}
                        </P>
                    </View>

                    {/* Status and Action Row */}
                    <View style={styles.footerRow}>
                        <View style={[styles.statusBadge, themed.statusBadge]}>
                            <P size={13} style={[styles.statusText, { color: statusColors.text }]}>
                                {booking.statusLabel}
                            </P>
                        </View>

                        {booking.actionLabel && (
                            <TouchableOpacity>
                                <P size={14} style={[styles.actionButton, themed.actionButton]}>
                                    {booking.actionLabel}
                                </P>
                            </TouchableOpacity>
                        )}

                        {booking.teamMembers && booking.teamMembers.length > 0 && (
                            <View style={styles.teamAvatars}>
                                {booking.teamMembers.map((member, index) => (
                                    <Image
                                        key={member.id}
                                        source={member.avatar}
                                        style={[
                                            styles.teamAvatar,
                                            index > 0 && { marginLeft: -8 },
                                        ]}
                                    />
                                ))}
                                {booking.teamCount && (
                                    <View style={[styles.teamAvatar, styles.teamCountBadge]}>
                                        <P size={12} style={styles.teamCountText}>
                                            {booking.teamCount}
                                        </P>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#3B82F6',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        gap: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContent: {
        flex: 1,
        gap: 4,
    },
    title: {
        textAlign: 'left',
        fontWeight: '600',
    },
    subtitle: {
        textAlign: 'left',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: {
        fontWeight: '600',
    },
    actionButton: {
        fontWeight: '600',
    },
    teamAvatars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    teamAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#1E2936',
    },
    teamCountBadge: {
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
    },
    teamCountText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

export default BookingCard;
