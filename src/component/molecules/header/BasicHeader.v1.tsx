/* eslint sort-keys: 0 */
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { HeaderContainer } from './HeaderContainer.v1'

export interface HeaderProps {
  leftComponent?: React.ReactNode
  centerComponent?: React.ReactNode
  rightComponent?: React.ReactNode
  style?: StyleProp<ViewStyle>
  leftComponentContainerStyle?: StyleProp<ViewStyle>
  rightComponentContainerStyle?: StyleProp<ViewStyle>
  centerComponentContainerStyle?: StyleProp<ViewStyle>
  testId?: string
}

/**
 * BasicHeader is a header component that consists of left, center, and right components, in which the left and right components are of fixed width of 60px. The component implements HeaderContainer component to wrap the header content.
 *
 * @param {HeaderProps} props - The properties for the BasicHeader component
 * @param {React.ReactNode} props.leftComponent - The left component of the header
 * @param {React.ReactNode} props.centerComponent - The center component of the header
 * @param {React.ReactNode} props.rightComponent - The right component of the header
 * @param {StyleProp<ViewStyle>} props.style - The style of the header
 * @param {StyleProp<ViewStyle>} props.leftComponentContainerStyle - The style of the left component container
 * @param {StyleProp<ViewStyle>} props.rightComponentContainerStyle - The style of the right component container
 * @param {StyleProp<ViewStyle>} props.centerComponentContainerStyle - The style of the center component container
 * @returns {JSX.Element} - The header component
 *
 * @example
 * <BasicHeader
 *  leftComponent={<View style={{ flexDirection: 'row' }}>
        <Image source={placeholderAssets.icon} />
      </View>}
 *  centerComponent={<Text>Header Title</Text>}
 * />
 *
 */
export const BasicHeader = ({
  leftComponent,
  centerComponent,
  rightComponent,
  style,
  leftComponentContainerStyle,
  rightComponentContainerStyle,
  centerComponentContainerStyle,
  testId
}: HeaderProps) => {
  const styles = createStyles()
  return (
    <HeaderContainer style={style}>
      {/* Left Component */}
      <View
        testID={`basic-header-left-component-container-${testId || 'default'}`}
        style={[styles.sideContainer, leftComponentContainerStyle]}
      >
        {leftComponent}
      </View>

      {/* Center Component */}
      <View
        testID='basic-header-center-component-container'
        style={[styles.centerContainer, centerComponentContainerStyle]}
      >
        {centerComponent}
      </View>

      {/* Right Component */}
      <View
        testID='basic-header-right-component-container'
        style={[styles.sideContainer, rightComponentContainerStyle]}
      >
        {rightComponent}
      </View>
    </HeaderContainer>
  )
}

const createStyles = () => {
  const styles = StyleSheet.create({
    centerContainer: {
      flex: 1, // Allow center to take remaining space
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideContainer: {
      width: 60, // Fixed width for left and right components
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
  return styles
}


