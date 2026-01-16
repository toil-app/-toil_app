import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H2, H6, P } from '@components/atoms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface StatCardProps {
    icon: string;
    iconColor: string;
    value: string | number;
    label: string;
    subtitle: string;
    onPress?: () => void;
    style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon,
    iconColor,
    value,
    label,
    subtitle,
    onPress,
    style,
}) => {
    const theme: any = useTheme();

    const themed = StyleSheet.create({
        card: {
            backgroundColor: theme.background01 ? theme.background01(100) : '#0F1720',
            borderWidth: 1,
            borderColor: theme.background01 ? theme.background01(25) : '#1a2332',
        },
    });

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.card, themed.card, style]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.row}>
                <View style={[styles.iconCircle, { backgroundColor: iconColor + '20' }]}>
                    <Icon name={icon} size={24} color={iconColor} />
                </View>
                <View style={styles.content}>
                    <H2 themeToken="text01" style={styles.value}>
                        {value}
                    </H2>
                </View>
            </View>
            <H6 themeToken="text01" themeShade={100} style={styles.label}>
                {label}
            </H6>
            <P themeToken="text01" themeShade={50} style={styles.subtitle}>
                {subtitle}
            </P>
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    value: {
        fontWeight: 'bold',
        textAlign: 'right',
    },
    label: {
        fontWeight: '600',
        marginBottom: 2,
        textAlign: 'left',
    },
    subtitle: {
        textAlign: 'left',
    },
});
