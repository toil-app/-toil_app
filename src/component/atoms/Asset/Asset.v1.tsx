import React from 'react'
import { Image, ImageProps, ImageStyle, StyleProp } from 'react-native'


export interface AssetProps extends ImageProps {
  source: ImageProps['source']
  style?: StyleProp<ImageStyle>
}


const Asset: React.FC<AssetProps> = ({ source, style, ...props }) => {
  return <Image source={source} style={style} {...props} />
}

export default Asset
