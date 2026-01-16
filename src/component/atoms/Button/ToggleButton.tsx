import React, { useCallback, useState } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import type { DimensionValue } from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { P } from "@components/atoms/Typhography/variants";

export type Props = {
    label: string;
    selected?: boolean; // controlled
    defaultSelected?: boolean; // uncontrolled initial
    onChange?: (selected: boolean) => void;
    disabled?: boolean;
    style?: ViewStyle;
    testID?: string;
    height?: number;
    width?: DimensionValue;
};

export const ToggleButton: React.FC<Props> = ({
    label,
    selected,
    defaultSelected = false,
    onChange,
    disabled = false,
    style,
    testID,
    height = 40,
    width = "auto",
}) => {
    const theme: any = useTheme();

    // uncontrolled if selected prop is undefined
    const [internalSelected, setInternalSelected] = useState<boolean>(defaultSelected);
    const isControlled = typeof selected === "boolean";
    const isSelected = isControlled ? (selected as boolean) : internalSelected;

    const handlePress = useCallback(() => {
        if (disabled) return;
        const next = !isSelected;
        if (!isControlled) setInternalSelected(next);
        onChange?.(next);
    }, [disabled, isSelected, isControlled, onChange]);

    const bg = typeof theme.background01 === "function"
        ? isSelected ? theme.background02(100) : theme.background01(100)
        : (isSelected ? "#e6f0ff" : "#f5f6f7");

    const labelShade = isSelected ? 50 : 75;

    const containerStyle: ViewStyle = {
        backgroundColor: bg,
        height,
        width,
        borderRadius: typeof theme.radii?.sm === "number" ? theme.radii.sm : 8,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        opacity: disabled ? 0.6 : 1,
    };

    return (
        <TouchableOpacity
            testID={testID}
            accessible
            accessibilityRole="button"
            accessibilityState={{ disabled, selected: isSelected }}
            activeOpacity={disabled ? 1 : 0.8}
            onPress={handlePress}
            style={[styles.button, containerStyle, style]}
        >
            <P size={isSelected ? 14 : 12} themeToken="text02" themeShade={labelShade} style={[styles.label, { fontWeight: isSelected ? 'bold' : "400" }]}>
                {label}
            </P>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignSelf: "flex-start",
    } as ViewStyle,
    label: {
        textAlign: "center",
    } as TextStyle,
});

