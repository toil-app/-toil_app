import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { H2, P } from '@components/atoms';

export interface EarningsCardProps {
    amount: number;
    percentage: number;
    currency?: string;
    period?: string;
    style?: ViewStyle;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
    amount,
    percentage,
    currency = '$',
    period = 'This Week',
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

    const isPositive = percentage >= 0;
    const badgeBg = isPositive ? '#10B981' : '#EF4444';
    const chartBarBg = theme.primary01 ? theme.primary01(60) : '#3B82F6';

    return (
        <View style={[styles.card, themed.card, style]}>
            <View style={styles.header}>
                <P themeShade={75} style={styles.period}>
                    {period}
                </P>
            </View>
            <View style={styles.amountContainer}>
                <H2 themeToken="text01" style={styles.amount}>
                    {currency}{amount.toFixed(2)}
                </H2>
                <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                    <P style={styles.percentage}>
                        {isPositive ? '+' : ''}{percentage.toFixed(1)}%
                    </P>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.chart}>
                    {/* Simple bar chart representation */}
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                        const heights = [60, 45, 80, 55, 90, 70, 85];
                        return (
                            <View key={index} style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: heights[index],
                                            backgroundColor: chartBarBg,
                                        },
                                    ]}
                                />
                                <P themeToken="text02" themeShade={75} style={styles.dayLabel}>
                                    {day}
                                </P>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    period: {
        fontSize: 14,
        fontWeight: '600',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    amount: {
        fontSize: 36,
        fontWeight: 'bold',
        marginRight: 12,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    percentage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    chartContainer: {
        height: 120,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: '100%',
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 2,
    },
    bar: {
        width: '80%',
        borderRadius: 4,
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 10,
    },
});
