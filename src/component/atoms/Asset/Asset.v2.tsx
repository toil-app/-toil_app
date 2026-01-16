import React, { useState } from 'react'
import {
  ColorValue,
  Image,
  ImageProps,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'


export interface AssetV2Props extends ImageProps {

  image: ImageProps['source']
  placeHolder: ImageProps['source']
  componentStyle?: {
    containerStyle?: StyleProp<ViewStyle>
    imageStyle?: StyleProp<ImageStyle>
    activityIndicatorColor?: ColorValue
  }
}

const Asset_V2: React.FC<AssetV2Props> = ({
  image,
  placeHolder,
  componentStyle
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [hasImageFailed, setHasImageFailed] = useState(false)

  return (
    <View style={[styles.container, componentStyle?.containerStyle]}>
      {/*  Show loader only when image is loading */}
      {/*  Show placeholder only if image fails */}
      {hasImageFailed && placeHolder && (
        <Image
          source={placeHolder}
          style={[styles.image, componentStyle?.imageStyle]}
          resizeMode='cover'
        />
      )}

      {/*  Show image only after successful load */}
      {image && (
        <Image
          source={image}
          style={[
            styles.image,
            componentStyle?.imageStyle,
            !isImageLoaded ? { height: 0, width: 0 } : {}
          ]}
          onLoadStart={() => {

          }}
          onLoad={() => {
            setIsImageLoaded(true)
            setHasImageFailed(false)
          }}
          onError={() => {
            setHasImageFailed(true)
            setIsImageLoaded(false)
          }}
          resizeMode='cover'
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
    width: '100%'
  }
  // loader: {
  //   position: 'absolute'
  // }
})

export default Asset_V2
