import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { useFont } from "@core/util/fonts/FontContext";
import { ThemeMode } from "@core/util/Theme";
import { relativeHeight } from "@core/util/Theme/layout";

export interface MyButtonProps {
  onPress: () => void;
  text: string;
  // optional styles passed from the consumer (manual style object)
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string; // optional, no default
}

export const MyButton = ({
  onPress,
  text,
  containerStyle,
  textStyle,
  testID, // optional
}: MyButtonProps) => {
  const theme = useTheme();
  const font = useFont();

  // derive values from theme/font with fallbacks
  const backgroundColor =
    typeof theme.button02 === "function" ? theme.button02(100) : "yellow";
  const textColor =
    typeof theme.text01 === "function" ? theme.text01(theme.mode === ThemeMode.LIGHT ? 25 : 100) : "#FFFFFF";
  const fontFamily = font?.medium ?? font?.regular;

  return (
    <TouchableOpacity
      // only attach testID when provided by consumer
      {...(testID ? { testID } : {})}
      style={[
        styles.container,
        { backgroundColor, opacity: 1 },
        containerStyle, // consumer override (manual style object)
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        {...(testID ? { testID: `${testID}-label` } : {})}
        style={[
          styles.text,
          { color: textColor, fontFamily },
          textStyle, // consumer override for text
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // default layout constraints
    width: 358, // default width; can be overridden by containerStyle (e.g. width: '100%')
    minWidth: 84,
    maxWidth: 480,
    height: relativeHeight(52),
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "flex-start",
    justifyContent: "center",
    // keep horizontal padding, text centered vertically
  } as ViewStyle,
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  } as TextStyle,
});
