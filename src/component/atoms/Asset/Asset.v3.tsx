import React from 'react';
import {
    ImageBackground,
    ImageBackgroundProps,
    ImageStyle,
    StyleProp,
    View,
    ViewStyle,
} from 'react-native';

export interface AssetV3Props extends Omit<ImageBackgroundProps, 'source'> {
    source: ImageBackgroundProps['source'];
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}

/**
 * AssetV3 - ImageBackground wrapper that exposes a content container for children.
 * Useful for hero banners where you want to render controls inside the image.
 */
const AssetV3: React.FC<AssetV3Props> = ({
    source,
    style,
    imageStyle,
    contentContainerStyle,
    children,
    ...rest
}) => {
    return (
        <ImageBackground source={source} style={style} imageStyle={imageStyle} {...rest}>
            <View style={[styles.fill, contentContainerStyle]}>{children}</View>
        </ImageBackground>
    );
};

const styles = {
    fill: { flex: 1 } as ViewStyle,
};

export default AssetV3;
