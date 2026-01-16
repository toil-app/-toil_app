import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { useFont } from "@core/util/fonts/FontContext";
import type { Shade } from "@core/util/fonts";

export type TypoVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface TypographyProps {
    children: React.ReactNode;
    variant?: TypoVariant;
    size?: number;
    lineHeight?: number;
    weight?: TextStyle["fontWeight"];
    textAlign?: TextStyle["textAlign"];
    // choose theme token or pass explicit color
    themeToken?: "text01" | "text02";
    themeShade?: Shade | number; // NEW: allow callers to control shade passed to theme functions
    color?: string;
    style?: StyleProp<TextStyle>;
    testID?: string;
    // allow manual fontFamily override if needed
    fontFamily?: string;
    // control how many lines to display and truncation behaviour
    numberOfLines?: number;
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

/**
 * Typography - single implementation for H1..H6 and paragraph.
 * Presets chosen so H1..P follow standard scale; callers can override size/lineHeight/color/testID/style.
 */
const PRESETS: Record<TypoVariant, { size: number; lineHeight: number; weight?: TextStyle["fontWeight"]; token?: "text01" | "text02" }> = {
    h1: { size: 36, lineHeight: 45, weight: "400", token: "text01" },
    h2: { size: 30, lineHeight: 40, weight: "400", token: "text01" },
    h3: { size: 28, lineHeight: 34, weight: "400", token: "text01" },
    h4: { size: 20, lineHeight: 32, weight: "400", token: "text01" },
    h5: { size: 16, lineHeight: 24, weight: "400", token: "text01" },
    h6: { size: 14, lineHeight: 20, weight: "400", token: "text01" },
    p: { size: 12, lineHeight: 20, weight: "400", token: "text01" },
};

export const Typography = ({
    children,
    variant = "h1",
    size,
    lineHeight,
    weight,
    textAlign = "center",
    themeToken,
    themeShade, // added prop
    color,
    style,
    testID,
    fontFamily,
    numberOfLines,
    ellipsizeMode,
}: TypographyProps) => {
    const theme: any = useTheme();
    const font = useFont();

    const preset = PRESETS[variant] || PRESETS.h1;

    const fontSize = size ?? preset.size;
    const computedLineHeight = lineHeight ?? preset.lineHeight;
    const fontWeight = weight ?? preset.weight ?? "400";

    // resolve theme color token
    let themeColor: string | undefined;
    const tokenToUse = themeToken ?? preset.token ?? "text01";
    const shadeToUse = typeof themeShade !== "undefined" ? themeShade : 100; // default 100 if not provided

    if (tokenToUse === "text02") {
        themeColor = typeof theme.text02 === "function" ? theme.text02(shadeToUse) : undefined;
    } else {
        themeColor = typeof theme.text01 === "function" ? theme.text01(shadeToUse) : undefined;
    }

    const resolvedColor = color ?? themeColor ?? "#000";

    const resolvedFontFamily = fontFamily ?? font?.regular ?? undefined;

    return (
        <Text
            {...(testID ? { testID } : {})}
            {...(typeof numberOfLines === "number" ? { numberOfLines } : {})}
            {...(ellipsizeMode ? { ellipsizeMode } : {})}
            style={[
                styles.base,
                {
                    fontSize,
                    lineHeight: computedLineHeight,
                    textAlign,
                    color: resolvedColor,
                    fontWeight,
                    fontFamily: resolvedFontFamily,
                } as TextStyle,
                style,
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        // minimal base; all specifics are applied inline so callers can override
    } as TextStyle,
});

