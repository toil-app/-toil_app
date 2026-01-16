import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';

type Props = {
    total?: number;
    activeIndex?: number; // zero-based
    size?: number; // dot height
    activeWidth?: number; // active dot width (can be elongated)
    spacing?: number; // gap between dots
    containerStyle?: ViewStyle;
};

const DottedSteps: React.FC<Props> = ({
    total = 5,
    activeIndex = 0,
    size = 8,
    activeWidth = 22,
    spacing = 8,
    containerStyle,
}) => {
    const theme: any = useTheme();

    const inactiveColor = typeof theme.text02 === 'function' ? theme.text02(50) : theme.text02 || '#2B3940';
    const activeColor = typeof theme.primary01 === 'function' ? theme.primary01(125) : theme.primary01 || '#2B90FF';

    const items = Array.from({ length: total }).map((_, i) => {
        const active = i === activeIndex;
        const width = active ? activeWidth : size;
        const borderRadius = Math.round(size / 2);
        return (
            <View
                key={i}
                style={[
                    styles.dot,
                    {
                        width,
                        height: size,
                        borderRadius: active ? Math.round(activeWidth / 2) : borderRadius,
                        backgroundColor: active ? activeColor : inactiveColor,
                        marginHorizontal: spacing / 2,
                    },
                ]}
            />
        );
    });

    return <View style={[styles.container, containerStyle]}>{items}</View>;
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    dot: {},
});

export default DottedSteps;
