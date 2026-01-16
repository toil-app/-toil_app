import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H2, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface TeamStatCardProps {
    icon: string;
    iconColor: string;
    label: string;
    value: string | number;
    style?: ViewStyle;
}

export const TeamStatCard: React.FC<TeamStatCardProps> = ({
    icon,
    iconColor,
    label,
    value,
    style,
}) => {
    const theme: any = useTheme();

    const themed = StyleSheet.create({
        card: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#1E2936',
        },
    });

    return (
        <View style={[styles.card, themed.card, style]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <Icon name={icon} size={28} color={iconColor} />
                </View>
                <P numberOfLines={2} themeShade={75} style={styles.label}>
                    {label}
                </P>
            </View>
            <H2 themeToken="text01" style={styles.value}>
                {value}
            </H2>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        flex: 1,
    },
    value: {
        fontWeight: 'bold',
    },
});
