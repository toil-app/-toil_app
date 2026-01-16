import { AdapterConfigParams } from '@core/util/AdapterConfigParam.util'
import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'

// Import other components as needed

// Centralized type definitions for adapter types
enum AdapterTypes { }
// Add other types here...

// Interface for Adapter Config Props
export interface AdapterConfigProps {
  adapterConfig: Map<AdapterConfigParams, any>
}

// Component map with type safety
const componentMap: Record<
  AdapterTypes,
  React.ComponentType<AdapterConfigProps>
> = {}

export default function getComponent(
  param: Map<AdapterConfigParams, any>
): ReactElement {
  const config: any = param.get(AdapterConfigParams.pageconfig)

  if (config && config.adapter?.type) {
    const BodyComponent = componentMap[config.adapter.type as AdapterTypes]
    if (BodyComponent) {
      return <BodyComponent adapterConfig={param} />
    }
  }

  return (
    <View>
      <Text>Component not found</Text>
    </View>
  )
}
