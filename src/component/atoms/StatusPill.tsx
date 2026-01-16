import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';

type Status = 'confirmed' | 'waiting' | 'inprogress' | 'done' | 'searching';

const StatusPill: React.FC<{ status: Status; children?: React.ReactNode }> = ({ status, children }) => {
    const theme: any = useTheme();

    const styles = StyleSheet.create({
        base: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 14,
            minWidth: 72,
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: { fontSize: 12, fontWeight: '600' },
    });

    const map: Record<Status, { bg: string; color: string }> = {
        confirmed: { bg: theme.primary01 ? theme.primary01(100) : '#1e90ff', color: '#fff' },
        waiting: { bg: theme.positive ? theme.positive(20) : '#a16207', color: theme.text01 ? theme.text01(100) : '#fff' },
        inprogress: { bg: theme.positive ? theme.positive(60) : '#064e3b', color: '#fff' },
        done: { bg: theme.background02 ? theme.background02(60) : '#475569', color: '#fff' },
        searching: { bg: theme.background01 ? theme.background01(25) : '#0f1724', color: theme.text02 ? theme.text02(80) : '#94a3b8' },
    };

    const colors = map[status] || map.searching;

    return (
        <View style={[styles.base, { backgroundColor: colors.bg }]}>
            <Text style={[styles.text, { color: colors.color }]}>{children}</Text>
        </View>
    );
};

export default StatusPill;
