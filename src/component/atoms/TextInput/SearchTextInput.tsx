import React, { forwardRef } from "react";
import { ViewStyle, StyleProp, Image } from "react-native";
import { TextInput } from "./TextInput";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { Icons } from "@assets/icons";
import { relativeWidth } from "@core/util/Theme/layout";

// Export props based on underlying TextInput so the wrapper stays flexible
type BaseProps = React.ComponentProps<typeof TextInput>;

export interface SearchTextInputProps extends Omit<BaseProps, "leftIcon" | "placeholder" | "containerStyle"> {
    containerStyle?: StyleProp<ViewStyle>;
    leftIcon?: React.ReactNode;
    placeholder?: string;
    testID?: string; // optional
    onPressWhenDisabled?: () => void; // optional button-like behavior
}



export const SearchTextInput = forwardRef<any, SearchTextInputProps>(
    ({ placeholder = "Search past tasks", leftIcon, containerStyle, testID, ...rest }, ref) => {
        const theme = useTheme();

        // detect disabled state from forwarded props
        const disabled = (rest as any).editable === false;
        // derive a subtle background using available theme tokens; prefer secondary01 light tint if available.
        // when disabled use a lighter background (background01(25))
        const background = disabled
            ? (typeof theme.background01 === "function" ? theme.background01(25) : theme.light ?? "#F3F6F8")
            : (typeof theme.secondary01 === "function"
                ? theme.secondary01(75)
                : typeof theme.background01 === "function"
                    ? theme.background01(75)
                    : theme.light ?? "#F3F6F8");

        // build a safe icon node: support passed leftIcon, image asset (number), or component (SVG)
        let iconNode: React.ReactNode = leftIcon ?? null;
        if (!iconNode) {
            const searchAsset: any = (Icons as any).sa_search;
            if (typeof searchAsset === "number") {
                iconNode = (
                    <Image
                        source={searchAsset}
                        style={{ width: 18, height: 18, tintColor: theme.text01 ? theme.text01(100) : undefined }}
                        resizeMode="contain"
                    />
                );
            } else if (searchAsset) {
                const IconComp = searchAsset as any;
                iconNode = <IconComp width={18} height={18} />;
            }
        }

        // If disabled, render a TouchableOpacity overlay to act as a button


        return (
            <TextInput
                ref={ref}
                {...rest}
                // only attach testID when provided
                {...(testID ? { testID } : {})}
                placeholder={placeholder}
                leftIcon={iconNode}
                clearable={true}
                // default layout tuned for search bar; consumer can override via containerStyle
                containerStyle={[
                    {
                        width: rest.width ?? relativeWidth(320),
                        height: rest.height ?? 48,
                        borderRadius: 12,
                        backgroundColor: background,
                        borderWidth: 0,
                    } as StyleProp<ViewStyle>,
                    containerStyle,
                ]}
                // keep text centered vertically and subtle styling
                inputStyle={[
                    {
                        fontSize: 16,
                        paddingVertical: 0,
                        // fontFamily left to TextInput to resolve from font context
                    },
                ]}
            />
        );
    }
);


