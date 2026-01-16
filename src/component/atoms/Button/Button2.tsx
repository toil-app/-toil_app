import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    StyleProp,
    GestureResponderEvent,
} from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { useFont } from "@core/util/fonts/FontContext";


export interface Button2Props {
    text: string;
    onPress?: (e: GestureResponderEvent) => void;
    disabled?: boolean;
    selected?: boolean;
    // sizing / style overrides
    width?: number | string;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    testID?: string; // optional
}

/**
 * Button2 - pill style button, theme-aware, supports disabled & selected states.
 * - default background: theme.background01(100)
 * - default text: theme.text01(100)
 * - disabled background: theme.background01(50), text: theme.text01(50)
 * - selected outline: theme.primary01(100)
 */
export const Button2 = ({
    text,
    onPress,
    disabled = false,
    selected = false,
    width = 358,
    height = 48,
    minWidth = 84,
    maxWidth = 480,
    containerStyle,
    textStyle,
    testID,
}: Button2Props) => {
    const theme = useTheme();
    const font = useFont();

    // colors derived from theme with fallbacks
    const bgDefault = typeof theme.background01 === "function" ? theme.background01(100) : (theme as any).light ?? "#fff";
    const bgDisabled = typeof theme.background01 === "function" ? theme.background01(75) : (theme as any).light ?? "#f0f0f0";
    const textDefault = typeof theme.text01 === "function" ? theme.text01(100) : (theme as any).dark ?? "#000";
    const textDisabled = typeof theme.text01 === "function" ? theme.text01(75) : (theme as any).dark ?? "#999";
    const primaryOutline = typeof theme.primary01 === "function" ? theme.primary01(100) : (theme as any).primary ?? "#157AFF";

    const backgroundColor = disabled ? bgDisabled : bgDefault;
    const color = disabled ? textDisabled : textDefault;

    const borderStyle = selected
        ? { borderWidth: 2, borderColor: primaryOutline }
        : { borderWidth: 0 };

    const effectiveTestId = typeof testID === "string" && testID.length > 0 ? testID : undefined;

    return (
        <TouchableOpacity
            {...(effectiveTestId ? { testID: effectiveTestId } : {})}
            activeOpacity={disabled ? 1 : 0.8}
            onPress={!disabled ? onPress : undefined}
            accessibilityState={{ disabled }}
            style={[
                styles.container,
                {
                    width,
                    minWidth,
                    maxWidth,
                    height,
                    borderRadius: 12,
                    backgroundColor,
                    opacity: disabled ? 0.9 : 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 20,
                    paddingRight: 20,
                } as ViewStyle,
                borderStyle,
                containerStyle,
            ]}
        >
            <Text
                {...(effectiveTestId ? { testID: `${effectiveTestId}-label` } : {})}
                style={[
                    styles.text,
                    {
                        color,
                        fontFamily: font?.medium ?? font?.regular,
                    } as TextStyle,
                    textStyle,
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle,
    text: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    } as TextStyle,
});

