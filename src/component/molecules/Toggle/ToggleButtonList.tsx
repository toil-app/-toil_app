import React, { useState, useCallback } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { ToggleButton } from "../../atoms/Button/ToggleButton";
import { useTheme } from "@core/util/Theme/ThemeContext";

export type Option = {
    key: string;
    label: string;
};

export type Props = {
    options?: Option[]; // defaults to 3 options if not provided
    selectedKey?: string; // controlled
    defaultSelectedKey?: string; // uncontrolled initial
    onChange?: (key: string) => void;
    disabled?: boolean;
    style?: ViewStyle;
    spacing?: number; // gap between buttons
};

export const ToggleButtonList: React.FC<Props> = ({
    options = [
        { key: "one", label: "One" },
        { key: "two", label: "Two" },
        { key: "three", label: "Three" },
    ],
    selectedKey,
    defaultSelectedKey,
    onChange,
    disabled = false,
    style,
    spacing: _spacing = 8,
}) => {
    const theme: any = useTheme();
    const bgColor =
        typeof (theme as any).background01 === "function"
            ? (theme as any).background01(100)
            : "#f7f7f8";
    const padding = typeof (theme as any).spacing?.sm === "number" ? (theme as any).spacing.sm : 6;
    const listRadius = typeof (theme as any).radii?.lg === "number" ? (theme as any).radii.lg : 12;

    const [internalSelected, setInternalSelected] = useState<string | undefined>(defaultSelectedKey);
    const isControlled = typeof selectedKey !== "undefined";
    const current = isControlled ? selectedKey : internalSelected;

    const handlePress = useCallback(
        (key: string) => {
            if (disabled) return;
            if (!isControlled) setInternalSelected(key);
            onChange?.(key);
        },
        [disabled, isControlled, onChange]
    );

    return (
        <View style={[{ backgroundColor: bgColor, padding, borderRadius: listRadius }, styles.row, style]}>
            {options.map((opt, idx) => (
                <View key={opt.key} style={[styles.flexItem, idx < options.length - 1 ? styles.gap : undefined]}>
                    <ToggleButton
                        label={opt.label}
                        selected={current === opt.key}
                        onChange={() => handlePress(opt.key)}
                        disabled={disabled}
                        style={styles.fullWidth}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    flexItem: { flex: 1 },
    fullWidth: { width: '100%' },
    gap: { marginRight: 8 },
});
