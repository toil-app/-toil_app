import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface TaskCardProps {
    time?: string;
    title: string;
    subtitle?: string;
    status: 'in_progress' | 'assigned' | 'scheduled' | 'available';
    duration?: string;
    location?: string;
    onPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    subtitle,
    status,
    duration,
    location,
    onPress,
}) => {
    const theme: any = useTheme();

    const getStatusConfig = (statusType: string) => {
        switch (statusType) {
            case 'in_progress':
                return {
                    borderColor: theme.primary01 ? theme.primary01(100) : '#3B82F6',
                    statusBg: theme.primary01 ? theme.primary01(15) : '#DBEAFE',
                    statusText: theme.primary01 ? theme.primary01(100) : '#3B82F6',
                    borderStyle: 'solid' as const,
                };
            case 'assigned':
                return {
                    borderColor: theme.text02 ? theme.text02(50) : '#6B7280',
                    statusBg: theme.text02 ? theme.text02(10) : '#E5E7EB',
                    statusText: theme.text02 ? theme.text02(100) : '#374151',
                    borderStyle: 'solid' as const,
                };
            case 'scheduled':
                return {
                    borderColor: theme.success ? theme.success(100) : '#10B981',
                    statusBg: theme.success ? theme.success(15) : '#ECFDF5',
                    statusText: theme.success ? theme.success(100) : '#10B981',
                    borderStyle: 'solid' as const,
                };
            case 'available':
                return {
                    borderColor: theme.text02 ? theme.text02(30) : '#D1D5DB',
                    borderStyle: 'dashed' as const,
                    statusBg: 'transparent',
                    statusText: theme.text02 ? theme.text02(60) : '#9CA3AF',
                };
            default:
                return {
                    borderColor: theme.text02 ? theme.text02(50) : '#6B7280',
                    statusBg: theme.text02 ? theme.text02(10) : '#E5E7EB',
                    statusText: theme.text02 ? theme.text02(100) : '#374151',
                    borderStyle: 'solid' as const,
                };
        }
    };

    const statusConfig = getStatusConfig(status);
    const isAvailable = status === 'available';

    const themed = StyleSheet.create({
        card: {
            borderLeftColor: statusConfig.borderColor,
            borderLeftWidth: isAvailable ? 0 : 4,
            ...(isAvailable && {
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderStyle: statusConfig.borderStyle,
                borderColor: statusConfig.borderColor,
            }),
        },
        statusBadge: {
            backgroundColor: statusConfig.statusBg,
        },
        statusText: {
            color: statusConfig.statusText,
        },
    });

    return (
        <TouchableOpacity
            style={[styles.container, themed.card]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {isAvailable ? (
                <View style={styles.availableContent}>
                    <Icon
                        name="plus"
                        size={24}
                        color={statusConfig.statusText}
                        style={styles.availableIcon}
                    />
                    <P style={[styles.availableText, themed.statusText]}>
                        {title}
                    </P>
                </View>
            ) : (
                <>
                    <View style={styles.header}>
                        <H5 style={styles.title}>{title}</H5>
                        {status && (
                            <View style={[styles.statusBadge, themed.statusBadge]}>
                                <P style={[styles.statusLabel, themed.statusText]}>
                                    {status === 'in_progress'
                                        ? '● In Progress'
                                        : status === 'assigned'
                                            ? 'Assigned'
                                            : 'Scheduled'}
                                </P>
                            </View>
                        )}
                    </View>

                    {subtitle && (
                        <P style={styles.subtitle} themeToken="text02" themeShade={60}>
                            {subtitle}
                        </P>
                    )}

                    {(duration || location) && (
                        <View style={styles.details}>
                            {duration && (
                                <View style={styles.detail}>
                                    <Icon
                                        name="clock-outline"
                                        size={14}
                                        color={theme.text02 ? theme.text02(60) : '#9CA3AF'}
                                    />
                                    <P style={styles.detailText} themeToken="text02" themeShade={60}>
                                        {duration}
                                    </P>
                                </View>
                            )}

                            {location && (
                                <View style={styles.detail}>
                                    <Icon
                                        name="map-marker-outline"
                                        size={14}
                                        color={theme.text02 ? theme.text02(60) : '#9CA3AF'}
                                    />
                                    <P style={styles.detailText} themeToken="text02" themeShade={60}>
                                        {location}
                                    </P>
                                </View>
                            )}
                        </View>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
        borderRadius: 12,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    subtitle: {
        fontSize: 13,
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    details: {
        flexDirection: 'row',
        gap: 16,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 12,
    },
    availableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    availableIcon: {
        marginRight: 4,
    },
    availableText: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default TaskCard;
