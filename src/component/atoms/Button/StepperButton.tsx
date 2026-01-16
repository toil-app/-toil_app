import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { P } from '@components/atoms/Typhography/variants';
import { useTheme } from '@core/util/Theme/ThemeContext';

export type StepperButtonProps = {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
    decrementBackground?: string;
    incrementBackground?: string;
    textColor?: string;
    style?: ViewStyle;
};

export const StepperButton: React.FC<StepperButtonProps> = ({
    value,
    onIncrement,
    onDecrement,
    min = 1,
    max = 999,
    decrementBackground,
    incrementBackground,
    textColor,
    style,
}) => {
    const theme: any = useTheme();

    const decBg = decrementBackground ?? (theme.secondary01 ? theme.secondary01(100) : '#333');
    const incBg = incrementBackground ?? (theme.primary01 ? theme.primary01(125) : '#2E8BF8');
    const txtColor = textColor ?? (theme.light || '#fff');

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                accessibilityLabel="decrement"
                onPress={() => { if (value > min) onDecrement(); }}
                style={[styles.btn, { backgroundColor: decBg }]}
            >
                <P themeToken="text02" style={[styles.btnLabel, { color: txtColor }]}>−</P>
            </TouchableOpacity>

            <View style={styles.countWrap}><P style={[styles.countText, { color: txtColor }]}>{value}</P></View>

            <TouchableOpacity
                accessibilityLabel="increment"
                onPress={() => { if (value < max) onIncrement(); }}
                style={[styles.btn, { backgroundColor: incBg }]}
            >
                <P themeToken="text01" style={[styles.btnLabel, { color: txtColor }]}>+</P>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center' },
    btn: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6 },
    btnLabel: { fontSize: 20 },
    countWrap: { minWidth: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    countText: { fontSize: 18, fontWeight: '700' },
});

export default StepperButton;
