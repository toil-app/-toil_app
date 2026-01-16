import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { P } from "../Typhography/variants";
import { useTheme } from "@core/util/Theme";
import { Shade } from "@core/util/fonts";

export type Props = {
    value: number;
    max?: number;
    height?: number;
    showLabel?: boolean;
    style?: ViewStyle;
    labelShade?: Shade | number; // NEW: allows overriding theme.text02(...) shade for label
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export const Progressbar: React.FC<Props> = ({
    value,
    max = 5,
    height = 10,
    showLabel = true,
    style,
    labelShade,
}) => {
    const theme: any = useTheme();

    // Detect theme shapes and provide fallbacks
    const resolvePrimary = (shade?: any) => {
        if (typeof theme.primary01 === "function") return theme.primary01(shade ?? 100);
        if (theme.colors?.primary) return theme.colors.primary;
        return "#0d6efd";
    };
    const resolveSecondary = (shade?: any) => {
        if (typeof theme.secondary01 === "function") return theme.secondary01(shade ?? 100);
        if (theme.colors?.muted) return theme.colors.muted;
        if (theme.colors?.surface) return theme.colors.surface;
        return "#e9ecef";
    };

    const percent = clamp(value / Math.max(1, max), 0, 1) * 100;
    const trackColor = resolveSecondary(25); // background / track
    const progressColor = resolvePrimary(100); // filled bar color
    const radius = typeof theme.radii?.md === "number" ? theme.radii.md : 8;

    return (
        <View style={[{ width: "100%" }, style]}>
            <View
                accessible
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max, now: value }}
                style={[
                    styles.track,
                    {
                        backgroundColor: trackColor,
                        height,
                        borderRadius: radius,
                        overflow: "hidden",
                    },
                ]}
            >
                <View
                    style={{
                        width: `${percent}%`,
                        backgroundColor: progressColor,
                        height: "100%",
                    }}
                />
            </View>

            {showLabel ? (
                // pass labelShade through to the typography so callers can change the default 100
                <P themeToken="text02" themeShade={labelShade} style={{ marginTop: 8, textAlign: 'left' }}>
                    {`${value} of ${max} completed`}
                </P>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        width: "100%",
    },
    label: {
        fontSize: 14,
    },
});