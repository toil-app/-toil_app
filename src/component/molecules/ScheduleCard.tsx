import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H5, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScheduleCardProps {
    iconName: string;
    iconColor?: string;
    label: string;
    labelThemeToken?: 'text01' | 'text02';
    labelThemeShade?: number;
    value: string;
    subtitle: string;
    subtitleThemeToken?: 'text01' | 'text02';
    subtitleThemeShade?: number;
    cardStyle?: ViewStyle;
    useThemeColor?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    iconName,
    iconColor,
    label,
    labelThemeToken = 'text02',
    labelThemeShade = 75,
    value,
    subtitle,
    subtitleThemeToken = 'text02',
    subtitleThemeShade = 75,
    cardStyle,
    useThemeColor = false,
}) => {
    const theme: any = useTheme();

    const getIconColor = () => {
        if (iconColor) return iconColor;
        if (useThemeColor && theme.primary01) {
            return theme.primary01(100);
        }
        return theme.text02 ? theme.text02(75) : '#9CA3AF';
    };

    const getLabelColor = () => {
        if (useThemeColor && theme.primary01) {
            return theme.primary01(100);
        }
        return undefined;
    };

    const getSubtitleColor = () => {
        if (useThemeColor && theme.primary01) {
            return theme.primary01(100);
        }
        return undefined;
    };

    return (
        <View style={[styles.scheduleCard, cardStyle]}>
            <View style={styles.scheduleHeader}>
                <Icon
                    name={iconName}
                    size={18}
                    color={getIconColor()}
                />
                <P
                    textAlign="left"
                    themeToken={useThemeColor ? 'text01' : labelThemeToken}
                    themeShade={useThemeColor ? undefined : labelThemeShade}
                    size={13}
                    style={useThemeColor ? { color: getLabelColor() } : undefined}
                >
                    {label}
                </P>
            </View>
            <H5
                textAlign="left"
                themeToken="text01"
                themeShade={100}
                style={styles.scheduleValue}
            >
                {value}
            </H5>
            <P
                textAlign="left"
                themeToken={useThemeColor ? undefined : subtitleThemeToken}
                themeShade={useThemeColor ? undefined : subtitleThemeShade}
                size={13}
                style={useThemeColor ? { color: getSubtitleColor() } : undefined}
            >
                {subtitle}
            </P>
        </View>
    );
};

const styles = StyleSheet.create({
    scheduleCard: {
        width: '48%',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    scheduleValue: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 4,
        textAlign: 'left',
    },
});

export default ScheduleCard;
