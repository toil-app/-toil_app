import * as React from "react"
import Svg, { Path } from "react-native-svg"

export default (props)=> {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={30}
      fill="none"
      viewBox="0 0 30 30"
      {...props}
    >
      <Path
        fill={props.color||'#fff'}
        fillOpacity={0.9}
        d="M0 15C0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15z"
      />
      <Path
        fill="#828282"
        d="M23.75 8.012L21.988 6.25 15 13.238 8.012 6.25 6.25 8.012 13.238 15 6.25 21.988l1.762 1.762L15 16.762l6.988 6.988 1.762-1.762L16.762 15l6.988-6.988z"
      />
    </Svg>
  )
}
