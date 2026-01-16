import React, {
    forwardRef,
    useState,
    useImperativeHandle,
    ReactNode,
} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    TextInputProps,
} from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { useFont } from "@core/util/fonts/FontContext";
import TextInputLable from '../label/TextInputLable';

export type TextRef = {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    isFocused: () => boolean;
};



export interface CustomTextProps extends Omit<TextInputProps, "style"> {
    value?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    clearable?: boolean;
    helperText?: string;
    error?: boolean | string;
    label?: string;
    required?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    width?: number | string;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    borderRadius?: number;
    paddingHorizontal?: number;
    rotation?: number | string; // degrees
    testID?: string;
}

const DEFAULT_WIDTH = 358;
const DEFAULT_HEIGHT = 48;

export const TextInputLikeButton = forwardRef<TextRef, CustomTextProps>(
    (props, ref) => {
        const {
            value,
            defaultValue,
            multiline = false,
            numberOfLines,
            maxLength,
            editable = true,
            clearable = false,
            leftIcon,
            rightIcon,
            error,
            helperText,
            label,
            required = false,
            containerStyle,
            inputStyle,
            width = DEFAULT_WIDTH,
            height = DEFAULT_HEIGHT,
            minWidth = 84,
            maxWidth = 480,
            borderRadius = 8,
            paddingHorizontal = 20,
            rotation = 0,
            testID,
            ...rest
        } = props;
        const theme = useTheme();
        const font = useFont();
        // this component is an input-like button (not a real TextInput)
        // no native TextInput ref is required
        const [internalValue, setInternalValue] = useState<string>(value ?? defaultValue ?? "");
        // synchronize controlled value if provided
        React.useEffect(() => {
            if (typeof value === "string") {
                setInternalValue(value);
            }
        }, [value]);


        const handleClear = () => {
            // clear the internal value; since this is not a real TextInput
            // we simply update state. focus/clear on native ref are no-ops.
            setInternalValue("");
        };

        // expose a small imperative handle for parent refs
        useImperativeHandle(ref, () => ({
            focus: () => {
                // no-op for input-like button
            },
            blur: () => {
                // no-op for input-like button
            },
            clear: () => setInternalValue(""),
            isFocused: () => false,
        } as TextRef), []);

        // derive colors from theme safely (fallbacks)
        // prefer a background token if available; use lighter background when disabled
        const background = !editable
            ? (theme.background01 ? theme.background01(75) : theme.light ?? "#fff")
            : (theme.background01 ? theme.background01(100) : theme.light ?? "#fff");

        const errorColor = theme.negative ? theme.negative(100) : "#AF183C";
        const borderColor = error ? errorColor : (theme.secondary01 ? theme.secondary01(100) : "#E9EEF3");

        // pick text colors: when disabled use a lighter text token (text01(25)), otherwise normal (text01(100))
        const disabledTextColor = theme.text01 ? theme.text01(75) : "#8A96A3";
        const normalTextColor = theme.text01 ? theme.text01(100) : "#1F2933";
        const baseTextColor = !editable ? disabledTextColor : normalTextColor;


        // When there is an error, label/value should show error color; otherwise use baseTextColor
        const inputTextColor = error ? errorColor : baseTextColor;


        const rotateValue = typeof rotation === "number" ? `${rotation}deg` : rotation;

        // build derived ids only if testID was provided
        const hasTestId = typeof testID === "string" && testID.length > 0;
        const effectiveTestId = hasTestId ? testID! : undefined;
        const labelTestId = effectiveTestId ? `${effectiveTestId}-label` : undefined;
        const containerTestId = effectiveTestId ? `${effectiveTestId}-container` : undefined;
        const inputTestId = effectiveTestId ? `${effectiveTestId}-input` : undefined;
        const clearTestId = effectiveTestId ? `${effectiveTestId}-clear` : undefined;
        const helperTestId = effectiveTestId ? `${effectiveTestId}-helper` : undefined;
        const counterTestId = effectiveTestId ? `${effectiveTestId}-counter` : undefined;

        // dynamic styles created with theme-derived values to avoid inline style usage
        const dynamicStyles = StyleSheet.create({
            containerDynamic: {
                height,
                borderRadius,
                paddingLeft: paddingHorizontal,
                paddingRight: paddingHorizontal,
                backgroundColor: background,
                borderColor: borderColor,
                borderWidth: 1,
                justifyContent: 'center',
            } as ViewStyle,
            inputDynamic: {
                color: inputTextColor,
                textAlign: 'left',
                fontFamily: font?.regular,
                height: multiline ? Math.max(44, (numberOfLines ?? 1) * 20) : height,
            } as TextStyle,
            helperTextDynamic: {
                color: error ? errorColor : "#8A96A3",
            } as TextStyle,
            clearTextColor: {
                color: inputTextColor,
            } as TextStyle,
            counterColor: {
                color: inputTextColor,
            } as TextStyle,
        });


        return (
            <View
                // attach testID only when provided
                {...(containerTestId ? { testID: containerTestId } : {})}
                style={[
                    styles.wrapper,
                    {
                        width,
                        minWidth,
                        maxWidth,
                        opacity: 1,
                        transform: [{ rotate: rotateValue }],
                    } as ViewStyle,
                    containerStyle,
                ]}
            >
                {/* Label */}
                {/* centralized label component */}
                {/* existing styles and color are passed into the reusable component */}
                {label ? (
                    <TextInputLable
                        label={label}
                        required={required}
                        error={Boolean(error)}
                        editable={editable}
                        testID={labelTestId}
                        style={styles.label}
                        requiredStyle={styles.required}
                    />
                ) : null}

                <TouchableOpacity
                    style={[
                        styles.container,
                        dynamicStyles.containerDynamic,
                    ]}
                >
                    {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
                    <Text
                        testID={inputTestId}
                        style={[
                            styles.input,
                            { color: inputTextColor },
                            inputStyle,
                        ]}
                        {...rest}
                    >
                        {internalValue}
                    </Text>
                    {/* right icon / clear button / counter */}
                    <View style={styles.rightArea}>
                        {clearable && internalValue?.length ? (
                            <TouchableOpacity
                                onPress={handleClear}
                                style={styles.clearButton}
                                accessibilityLabel="clear"
                                {...(clearTestId ? { testID: clearTestId } : {})}
                            >
                                <Text style={[styles.clearText, dynamicStyles.clearTextColor]}>×</Text>
                            </TouchableOpacity>
                        ) : rightIcon ? (
                            <View style={styles.iconRight}>{rightIcon}</View>
                        ) : null}
                    </View>
                </TouchableOpacity>

                {/* helper text / error / counter */}
                <View style={styles.metaRow}>
                    <Text {...(helperTestId ? { testID: helperTestId } : {})} style={[styles.helperText, dynamicStyles.helperTextDynamic]}>
                        {error ? (typeof error === "string" ? error : helperText ?? "") : helperText ?? ""}
                    </Text>
                    {typeof maxLength === "number" ? (
                        <Text {...(counterTestId ? { testID: counterTestId } : {})} style={[styles.counterText, dynamicStyles.counterColor]}>
                            {(internalValue ?? "").length}/{maxLength}
                        </Text>
                    ) : null}
                </View>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: "flex-start",
    } as ViewStyle,
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "600",
    } as TextStyle,
    required: {
        marginLeft: 4,
    } as TextStyle,
    container: {
        flexDirection: "row",
        alignItems: "center",
    } as ViewStyle,
    iconLeft: {
        marginRight: 8,
    } as ViewStyle,
    iconRight: {
        marginLeft: 8,
    } as ViewStyle,
    input: {
        flex: 1,
        paddingVertical: 0,
        fontSize: 16,
    } as TextStyle,
    rightArea: {
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
    } as ViewStyle,
    clearButton: {
        padding: 6,
        borderRadius: 12,
    } as ViewStyle,
    clearText: {
        fontSize: 18,
        lineHeight: 18,
    } as TextStyle,
    metaRow: {
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
    } as ViewStyle,
    helperText: {
        fontSize: 12,
    } as TextStyle,
    counterText: {
        fontSize: 12,
    } as TextStyle,
});

