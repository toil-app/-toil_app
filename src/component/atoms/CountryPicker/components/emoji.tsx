// @flow
import React from 'react'
import { Text } from 'react-native'
import { get } from './emoji/node_emoji'
import PropTypes from 'prop-types'

function Emoji({ name }: { name: string }) {
  const emoji = get(name)

  return <Text>{emoji}</Text>
}

Emoji.propTypes = {
  name: PropTypes.string.isRequired
}

export default Emoji
