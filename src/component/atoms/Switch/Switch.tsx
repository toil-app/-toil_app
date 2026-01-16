import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, ViewStyle, View, Switch as NativeSwitch } from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { relativeHeight, relativeWidth } from "@core/util/Theme/layout";
import { ThemeMode } from "@core/util/Theme";

export type Props = {
    value?: boolean; // controlled
    defaultValue?: boolean; // uncontrolled initial
    onChange?: (next: boolean) => void;
    disabled?: boolean;
    width?: number;
    height?: number;
    style?: ViewStyle;
    testID?: string;
};

export const Switch: React.FC<Props> = ({
    value,
    defaultValue = false,
    onChange,
    disabled = false,
    width = relativeWidth(52),
    height = relativeHeight(32),
    style,
    testID,
}) => {
    const theme: any = useTheme();
    const isControlled = typeof value === "boolean";
    const [internal, setInternal] = useState<boolean>(defaultValue);
    const isOn = isControlled ? (value as boolean) : internal;

    useEffect(() => {
        if (isControlled) setInternal(value as boolean);
    }, [value, isControlled]);

    const handleChange = useCallback(
        (next: boolean) => {
            if (!isControlled) setInternal(next);
            onChange?.(next);
        },
        [isControlled, onChange]
    );

    // theme-driven colors with safe fallbacks
    const thumbOn = typeof theme.primary01 === "function" ? theme.primary01(100) : "#ffffff";
    const thumbOff = typeof theme.background01 === "function" ? theme.background01(100) : "#ffffff";
    const trackColor = {
        false: typeof theme.background01 === "function" ? theme.background01(25) : "#e5e7eb",
        true: typeof theme.primary01 === "function" ? theme.mode === ThemeMode.DARK ? theme.background02(100) : theme.primary01(25) : "#60a5fa",
    };

    return (
        <View style={[{ width, height }, styles.container, style as any]}>
            <NativeSwitch
                value={isOn}
                onValueChange={handleChange}
                disabled={disabled}
                trackColor={trackColor}
                thumbColor={isOn ? thumbOn : thumbOff}
                ios_backgroundColor={typeof theme.background01 === "function" ? theme.background01(10) : "#e5e7eb"}
                testID={testID}
                accessibilityRole="switch"
                accessibilityState={{ disabled, checked: isOn }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
});


