import React from 'react'
import { StyleSheet, View, KeyboardAvoidingView as NativeKeyboardAvoidingView, Platform } from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const KeyboardAvoidingView = (props: any) => (
  Platform.OS === 'android' ? <View {...props} style={[styles.container, props.styles]} /> :
    <NativeKeyboardAvoidingView
      keyboardVerticalOffset={props.offset || 0}
      behavior="padding"
      {...props}
      style={[styles.container, props.styles]}
    >
      <View style={styles.container}>{props.children}</View>
    </NativeKeyboardAvoidingView>
)

KeyboardAvoidingView.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  styles: PropTypes.array
}

export default KeyboardAvoidingView

