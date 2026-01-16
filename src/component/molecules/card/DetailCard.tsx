import React from "react";
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    ViewStyle,
    ImageStyle,
    TextStyle,
} from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { H5, P } from "../../atoms/Typhography/variants";
import { Icons } from "../../../assets/icons";
import Icon from 'react-native-vector-icons/Ionicons';

// small local Asset.v1 mapping so consumers can pass icon keys (keeps usage consistent with other atoms)
const Asset = { v1: Icons };

export type CardImage = {
    // either a bundled image asset key (Icons) or an icon name for vector icons
    key?: keyof typeof Icons; // e.g. "sa_check_dark"
    iconName?: string; // e.g. 'ios-close' (Ionicons) — if provided, a vector icon will render
    // optional explicit size override and style
    size?: number;
    style?: ImageStyle;
    onPress?: () => void; // optional image/icon-level press handler
    testID?: string; // optional testID for the image/icon wrapper
};

export type Props = {
    title: string;
    subtitle?: string | string[]; // allow single or multiple subtitle lines
    leftImage?: CardImage | null;
    rightImage?: CardImage | null;
    rightText?: string | null;
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[]; // allow both single style and array of styles
    // visual options
    imageShape?: "square" | "circle";
    // allow controlling subtitle lines when it's an array (center multiline scenario)
    subtitleNumberOfLines?: number;
};

export const DetailCard: React.FC<Props> = ({
    title,
    subtitle,
    leftImage,
    rightImage,
    rightText,
    onPress,
    style,
    imageShape = "circle",
    subtitleNumberOfLines = 2,
}) => {
    const theme: any = useTheme();

    const containerBg = typeof theme.background02 === "function" ? theme.background02(100) : theme.colors?.surface ?? "#fff";
    const innerBg = typeof theme.background01 === "function" ? theme.background01(100) : theme.colors?.background ?? "#fff";

    const titleProps = { themeToken: "text01" as const, themeShade: 100 };
    const subtitleProps = { themeToken: "text02" as const, themeShade: 50 };

    // render image or vector icon; left and right visuals should be pressable
    const renderImage = (img?: CardImage | null, defaultSize = 48) => {
        if (!img) return null;
        const size = img.size ?? defaultSize;
        const borderRadius = imageShape === 'circle' ? size / 2 : Math.max(6, size * 0.12);

        // prefer vector icon when iconName is provided
        if (img.iconName) {
            const iconContainerStyle: ImageStyle = {
                width: size,
                height: size,
                borderRadius,
                justifyContent: 'center',
                alignItems: 'center',
                ...img.style,
            } as ImageStyle;

            const iconSize = Math.round(size * 0.6);
            const iconColor = typeof theme.text01 === 'function' ? (theme.text01 as any)(100) : theme.text01 || '#000';
            const iconNode = (
                <View style={iconContainerStyle}>
                    <Icon name={img.iconName as string} size={iconSize} color={iconColor} />
                </View>
            );

            const handler = typeof img.onPress === 'function' ? img.onPress : undefined;
            return (
                <TouchableOpacity onPress={handler} activeOpacity={handler ? 0.8 : 1} {...(img.testID ? { testID: img.testID } : {})}>
                    {iconNode}
                </TouchableOpacity>
            );
        }

        // fallback to bundled image asset when key is provided
        if (img.key) {
            const src = Asset.v1[img.key];
            if (!src) return null;

            const imageStyle: ImageStyle = {
                width: size,
                height: size,
                borderRadius,
                resizeMode: 'cover',
                ...img.style,
            };

            const imageNode = <Image source={src as any} style={imageStyle} />;
            const handler = typeof img.onPress === 'function' ? img.onPress : undefined;
            return (
                <TouchableOpacity onPress={handler} activeOpacity={handler ? 0.8 : 1} {...(img.testID ? { testID: img.testID } : {})}>
                    {imageNode}
                </TouchableOpacity>
            );
        }

        return null;
    };

    // subtitle can be array (multi-line center) or string
    const renderSubtitle = (): React.ReactNode => {
        if (!subtitle) return null;
        if (Array.isArray(subtitle)) {
            return subtitle.map((s, i) => (
                <P key={i} {...subtitleProps} style={i === 0 ? styles.subtitleFirst : styles.subtitle}>
                    {s}
                </P>
            ));
        }
        return (
            <P {...subtitleProps} numberOfLines={subtitleNumberOfLines} style={styles.subtitle}>
                {subtitle}
            </P>
        );
    };

    const Content: React.ReactNode = (
        <View style={[styles.container, { backgroundColor: innerBg }, style]}>
            {/* left image if present */}
            {leftImage ? <View style={styles.leftImageWrap}>{renderImage(leftImage, 56)}</View> : null}

            {/* text column */}
            <View style={styles.textWrap}>
                <H5 {...titleProps} style={styles.title}>
                    {title}
                </H5>
                {renderSubtitle()}
            </View>

            {/* right area can be image or text */}
            <View style={styles.rightWrap}>
                {rightText ? (
                    <P {...subtitleProps} style={styles.rightText}>
                        {rightText}
                    </P>
                ) : null}

                {rightImage ? <View style={styles.rightImageWrap}>{renderImage(rightImage, 36)}</View> : null}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.outer, { backgroundColor: containerBg }]}>
                {Content}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.outer, { backgroundColor: containerBg }]}>{Content}</View>;
};

const styles = StyleSheet.create({
    outer: {
        borderRadius: 12,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
    },
    leftImageWrap: {
        marginRight: 12,
        width: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    textWrap: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        // H4 defaults; ensure left align
        textAlign: "left",
    } as TextStyle,
    subtitleFirst: {
        marginTop: 6,
        textAlign: "left",
    } as TextStyle,
    subtitle: {
        marginTop: 4,
        textAlign: "left",
    } as TextStyle,
    rightWrap: {
        marginLeft: 12,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    rightText: {
        textAlign: "right",
    } as TextStyle,
    rightImageWrap: {
        marginTop: 4,
        alignItems: "center",
        justifyContent: "center",
    },
});


