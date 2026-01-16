import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
    ImageSourcePropType,
    StyleProp
} from 'react-native'
import Asset from '@components/atoms/Asset/Asset.v1'
import { AdapterConfigProps } from '@core/helper/adapterbuilder';
import { useTheme } from '@core/util/Theme/ThemeContext';

// Define the types for the props
export interface NavigationHeaderProps extends AdapterConfigProps {
    title?: string // Optional Title
    subtitle?: string // Optional Subtitle
    backIcon?: ImageSourcePropType // Optional back icon (image source)
    frontIcon?: ImageSourcePropType // Optional front icon (image source)
    onBackPress?: () => void // Optional callback for back icon
    onFrontPress?: () => void // Optional callback for front icon
    titleStyle?: StyleProp<TextStyle> // Optional style for title
    subtitleStyle?: StyleProp<TextStyle> // Optional style for subtitle
    backIconStyle?: StyleProp<ViewStyle> // Optional style for the back icon
    frontIconStyle?: StyleProp<ViewStyle> // Optional style for the front icon
    containerStyle?: StyleProp<ViewStyle> // Optional style for the container

    // new optional color overrides — if provided, these take precedence over the theme defaults
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
}

const NavigationHeader_V1 = (props: NavigationHeaderProps) => {
    const {
        title,
        subtitle,
        backIcon,
        frontIcon,
        onBackPress,
        onFrontPress,
        titleStyle,
        subtitleStyle,
        backIconStyle,
        frontIconStyle,
        containerStyle,
        backgroundColor: bgProp,
        titleColor: titleColorProp,
        subtitleColor: subtitleColorProp
    } = props

    const theme = useTheme()

    // theme defaults
    const themeBackground =
        typeof (theme as any).background02 === 'function'
            ? (theme as any).background02(125)
            : typeof (theme as any).background01 === 'function'
                ? (theme as any).background01(100)
                : (theme as any).light ?? '#FFFFFF'

    const themeTitleColor =
        typeof (theme as any).text02 === 'function'
            ? (theme as any).text02(100)
            : typeof (theme as any).text01 === 'function'
                ? (theme as any).text01(100)
                : '#1E293B'

    const themeSubtitleColor =
        typeof (theme as any).text01 === 'function'
            ? (theme as any).text01(100)
            : '#4A5560'

    // final values: prop override > theme default
    const finalBackground = bgProp ?? themeBackground
    const finalTitleColor = titleColorProp ?? themeTitleColor
    const finalSubtitleColor = subtitleColorProp ?? themeSubtitleColor

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: finalBackground }, // use final background
                containerStyle,
            ]}
        >
            {/* Back Icon */}
            {backIcon && (
                <TouchableOpacity
                    onPress={onBackPress}
                    style={[styles.iconWrapper, backIconStyle]}
                >
                    <Asset source={backIcon} style={styles.icon} />
                </TouchableOpacity>
            )}

            {/* Title */}
            <View style={{ flexDirection: 'column' }}>
                {title && <Text style={[styles.title, { color: finalTitleColor }, titleStyle]}>{title}</Text>}

                {/* Subtitle */}
                {subtitle && (
                    <Text style={[styles.subtitle, { color: finalSubtitleColor }, subtitleStyle]}>{subtitle}</Text>
                )}
            </View>

            {/* Front Icon */}
            {frontIcon && (
                <TouchableOpacity
                    onPress={onFrontPress}
                    style={[styles.iconWrapper, frontIconStyle]}
                >
                    <Asset source={frontIcon} style={styles.icon} />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
        // marginLeft: 20,
        paddingHorizontal: 20,
        // marginTop: 14,
        paddingBottom: 8
    },
    icon: {
        height: 24,
        marginTop: 4,
        resizeMode: 'contain',
        width: 24
    },
    iconWrapper: {
        height: 16,
        resizeMode: 'contain',
        width: 16
    },
    subtitle: {},
    title: {
        color: '#1E293B',
        fontSize: 16,
        fontWeight: '600'
    }
})

export default NavigationHeader_V1