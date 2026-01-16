/* eslint sort-keys: 0 */
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

/**
 * HeaderContainer is a container component that wraps the header components, has a default fixed height of 60px and can be customized with additional styles.
 * It receives header content in props.children to allow for custom header content and renders them within a View component.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The header content to be rendered within the container.
 * @param {StyleProp<ViewStyle>} props.style - Additional styles for the container.
 *
 * @returns {JSX.Element} A view containing the header content.
 *
 * @example
 * <HeaderContainer style={{ backgroundColor: 'red' }}>
 *  <Text>Header Content</Text>
 * </HeaderContainer>
 *
 */
export const HeaderContainer = ({
  children,
  style
}: {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}) => {
  const styles = createStyles()
  return (
    <View testID='header-container' style={[styles.container, style]}>
      {children}
    </View>
  )
}

const createStyles = () => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 60,
      justifyContent: 'center'
    }
  })
  return styles
}

