import React from 'react'
import { TouchableNativeFeedback, TouchableOpacity, View, Platform, GestureResponderEvent } from 'react-native'
import PropTypes from 'prop-types'
import CloseIcon from "./Close";
import { useTheme } from '@core/util/Theme/ThemeContext';

const CloseButton = (props: { styles: any[]; onPress: ((event: GestureResponderEvent) => void) | undefined; }) => {
  const theme = useTheme()
  const primaryColor = typeof theme.primary01 === 'function' ? theme.primary01(100) : (theme.primary01(75) || '#157AFF')

  // defensive style handling: accept either an array or a single style object
  const containerStyle = Array.isArray(props.styles) ? props.styles[0] : props.styles || {}
  const innerStyle = Array.isArray(props.styles) ? props.styles[1] : undefined

  const icon = (
    <View style={innerStyle} pointerEvents="none">
      <CloseIcon color={primaryColor} />
    </View>
  )

  return (
    <View style={[containerStyle]}>
      {Platform.OS === 'android' ? (
        <TouchableNativeFeedback
          background={
            Platform.Version < 21
              ? TouchableNativeFeedback.SelectableBackground()
              : TouchableNativeFeedback.SelectableBackgroundBorderless()
          }
          onPress={props.onPress}
        >
          {/* TouchableNativeFeedback requires a single View child to show ripple correctly */}
          <View>
            {icon}
          </View>
        </TouchableNativeFeedback>
      ) : (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.7}>
          {icon}
        </TouchableOpacity>
      )}
    </View>
  )
}

CloseButton.propTypes = {
  styles: PropTypes.array,
  onPress: PropTypes.func,
  image: PropTypes.any
}

CloseButton.defaultProps = {
  styles: [],
  onPress: () => { }
}

export default CloseButton


