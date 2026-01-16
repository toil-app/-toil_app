import React from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ImageSourcePropType,
    StyleProp,
    ViewStyle,
} from "react-native";
import Asset from "@components/atoms/Asset/Asset.v1";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { H5, P } from "@components/atoms/Typhography/variants";

export interface ServiceCardProps {
    category: string;
    title: string;
    description?: string;
    imageSource?: ImageSourcePropType;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    disabled?: boolean;
}

export const ServiceCard = ({
    category,
    title,
    description,
    imageSource,
    onPress,
    style,
    testID,
    disabled = false,
}: ServiceCardProps) => {
    const theme: any = useTheme();

    const containerBg = theme.background02 ? theme.background01(100) : "#FFFFFF";
    const disabledBg = theme.background02 ? theme.background01(75) : "#F3F6F8";

    return (
        <TouchableOpacity
            {...(testID ? { testID } : {})}
            onPress={!disabled ? onPress : undefined}
            activeOpacity={disabled ? 1 : 0.8}
            style={[
                styles.card,
                { backgroundColor: disabled ? disabledBg : containerBg },
                style,
            ]}
        >
            <View style={styles.left}>
                {/* Top small secondary text */}
                <P themeShade={50} themeToken="text02" style={styles.category}>
                    {category}
                </P>

                {/* Middle title - H5 primary */}
                <H5 style={styles.title}>{title}</H5>

                {/* Third line: description - secondary P */}
                {description ? (
                    <P themeShade={50} themeToken="text02" style={styles.description} numberOfLines={2}>
                        {description}
                    </P>
                ) : null}
            </View>

            {/* Right image */}
            <View style={styles.right}>
                {imageSource ? (
                    <Asset source={imageSource} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        // borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        flex: 1,
        paddingRight: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    right: {
        width: 96,
        height: 64,
        marginLeft: 8,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
        objectFit: "cover",
        // Asset.v1 will render the provided image source
    },
    imagePlaceholder: {
        backgroundColor: "#EEE",
    },
    category: {
        fontSize: 14,
    },
    title: {
        textAlign: "left",
    },
    description: {
        fontSize: 14,
        textAlign: "left",
    },
});

