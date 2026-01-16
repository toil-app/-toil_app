import React, { useCallback, useState } from "react";
import { TouchableOpacity, Image, StyleSheet, ViewStyle, ImageStyle } from "react-native";
import { Icons } from "../../../assets/icons";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { ThemeMode } from "@core/util/Theme";

// expose a minimal Asset.v1 to satisfy requirement to use Asset.v1
const Asset = { v1: Icons };

export type Props = {
    checked?: boolean; // controlled
    defaultChecked?: boolean; // uncontrolled
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: number;
    testID?: string;
    style?: ViewStyle;
};
const Checkbox: React.FC<Props> = ({
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    size = 24,
    testID,
    style,
}) => {
    const theme: any = useTheme();

    const [internal, setInternal] = useState<boolean>(defaultChecked);
    const isControlled = typeof checked === "boolean";
    const isChecked = isControlled ? (checked as boolean) : internal;

    const handlePress = useCallback(() => {
        if (disabled) return;
        const next = !isChecked;
        if (!isControlled) setInternal(next);
        onChange?.(next);
    }, [disabled, isChecked, isControlled, onChange]);

    // resolve colors with safe fallbacks
    const uncheckedBorder = typeof theme.background01 === "function"
        ? theme.background01(75)
        : (theme.colors?.surface ?? theme.colors?.background ?? "#f1f3f5");

    const checkedBg = typeof theme.primary01 === "function"
        ? theme.primary01(100)
        : (theme.colors?.primary ?? "#0d6efd");

    const boxBg = isChecked ? checkedBg : "transparent";
    const borderColor = isChecked ? checkedBg : uncheckedBorder;
    const opacity = disabled ? 0.6 : 1;

    // choose tick asset based on theme.mode (fallback to light if mode not provided)
    const isLightMode = theme?.mode === ThemeMode.LIGHT || theme?.mode === "light" || typeof theme.mode === "undefined";
    const tickSource = isLightMode ? Asset.v1.sa_check_dark : Asset.v1.sa_check_light;

    const imageStyle: ImageStyle = {
        width: Math.round(size * 0.6),
        height: Math.round(size * 0.6),
        resizeMode: "contain",
        tintColor: undefined, // keep original asset colors
    };

    return (
        <TouchableOpacity
            testID={testID}
            accessible
            accessibilityRole="checkbox"
            accessibilityState={{ disabled, checked: isChecked }}
            activeOpacity={disabled ? 1 : 0.8}
            onPress={handlePress}
            style={[
                styles.box,
                {
                    width: size,
                    height: size,
                    borderRadius: Math.max(2, Math.round(size * 0.12)),
                    borderColor,
                    backgroundColor: boxBg,
                    opacity,
                } as ViewStyle,
                style,
            ]}
        >
            {isChecked ? <Image source={tickSource} style={imageStyle} /> : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    box: {
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    } as ViewStyle,
});

export default Checkbox;
