import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    ReactNode,
} from "react";
import {
    TextInput as RNTextInput,
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
import { SCREEN_WIDTH } from "@core/util/Theme/layout";

export type TextInputRef = {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    isFocused: () => boolean;
};

// Add InputType and include it in the public props
export type InputType = "text" | "number" | "decimal" | "phone" | "email" | "password" | "url";

export interface CustomTextInputProps extends Omit<TextInputProps, "style"> {
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
    type?: InputType; // new semantic input type
}

const DEFAULT_WIDTH = 358;
const DEFAULT_HEIGHT = 48;

export const TextInput = forwardRef<TextInputRef, CustomTextInputProps>(
    (
        {
            value,
            defaultValue,
            onChangeText,
            placeholder,
            secureTextEntry = false,
            keyboardType,
            multiline = false,
            numberOfLines,
            maxLength,
            editable = true,
            autoFocus = false,
            onFocus,
            onBlur,
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
            maxWidth = SCREEN_WIDTH - 40,
            borderRadius = 8,
            paddingHorizontal = 20,
            rotation = 0,
            testID,
            type = "text",
            ...rest
        },
        ref
    ) => {
        const theme = useTheme();
        const font = useFont();
        const internalRef = useRef<RNTextInput | null>(null);
        const [internalValue, setInternalValue] = useState<string>(value ?? defaultValue ?? "");
        const [_focused, setFocused] = useState(false);

        // synchronize controlled value if provided
        React.useEffect(() => {
            if (typeof value === "string") {
                setInternalValue(value);
            }
        }, [value]);

        useImperativeHandle(
            ref,
            (): TextInputRef => ({
                focus: () => internalRef.current?.focus(),
                blur: () => internalRef.current?.blur(),
                clear: () => {
                    internalRef.current?.clear();
                    setInternalValue("");
                    onChangeText?.("");
                },
                isFocused: () => internalRef.current?.isFocused() ?? false,
            }),
            [onChangeText]
        );

        const handleChangeText = (txt: string) => {
            if (value === undefined) {
                setInternalValue(txt);
            }
            onChangeText?.(txt);
        };

        const handleClear = () => {
            internalRef.current?.clear();
            setInternalValue("");
            onChangeText?.("");
            internalRef.current?.focus();
        };

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

        // Map semantic `type` to sensible defaults.
        const typeToKeyboard: Record<InputType, TextInputProps["keyboardType"]> = {
            text: "default",
            number: "numeric",
            decimal: "decimal-pad",
            phone: "phone-pad",
            email: "email-address",
            password: "default",
            url: "url",
        };

        const typeToContent: Record<InputType, TextInputProps["textContentType"] | undefined> = {
            text: undefined,
            number: "none",
            decimal: "none",
            phone: "telephoneNumber",
            email: "emailAddress",
            password: "password",
            url: "URL",
        };

        // Caller-provided values take precedence; otherwise derive from `type`
        const finalKeyboardType: TextInputProps["keyboardType"] = keyboardType ?? typeToKeyboard[type];
        const finalSecureEntry = secureTextEntry || type === "password";
        const finalTextContentType = (rest as any).textContentType ?? typeToContent[type];

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

                <View
                    style={[
                        styles.container,
                        {
                            height,
                            borderRadius,
                            paddingLeft: paddingHorizontal,
                            paddingRight: paddingHorizontal,
                            backgroundColor: background,
                            borderColor: borderColor,
                            borderWidth: 1,
                        },
                    ]}
                >
                    {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

                    <RNTextInput
                        {...(inputTestId ? { testID: inputTestId } : {})}
                        ref={internalRef}
                        style={[
                            styles.input,
                            {
                                color: inputTextColor,
                                fontFamily: font?.regular,
                                height: multiline ? Math.max(44, (numberOfLines ?? 1) * 20) : height,
                            },
                            inputStyle,
                        ]}
                        value={internalValue}
                        defaultValue={defaultValue}
                        onChangeText={handleChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={typeof baseTextColor === "string" ? `${baseTextColor}99` : "#8A96A3"}
                        secureTextEntry={finalSecureEntry}
                        keyboardType={finalKeyboardType}
                        textContentType={finalTextContentType}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        maxLength={maxLength}
                        editable={editable}
                        autoFocus={autoFocus}
                        onFocus={(e) => {
                            setFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setFocused(false);
                            onBlur?.(e);
                        }}
                        {...rest}
                    />

                    {/* right icon / clear button / counter */}
                    <View style={styles.rightArea}>
                        {clearable && internalValue?.length ? (
                            <TouchableOpacity
                                onPress={handleClear}
                                style={styles.clearButton}
                                accessibilityLabel="clear"
                                {...(clearTestId ? { testID: clearTestId } : {})}
                            >
                                <Text style={[styles.clearText, { color: inputTextColor }]}>×</Text>
                            </TouchableOpacity>
                        ) : rightIcon ? (
                            <View style={styles.iconRight}>{rightIcon}</View>
                        ) : null}
                    </View>
                </View>

                {/* helper text / error / counter */}
                <View style={styles.metaRow}>
                    <Text {...(helperTestId ? { testID: helperTestId } : {})} style={[styles.helperText, { color: error ? errorColor : "#8A96A3" }]}>
                        {error ? (typeof error === "string" ? error : helperText ?? "") : helperText ?? ""}
                    </Text>
                    {typeof maxLength === "number" ? (
                        <Text {...(counterTestId ? { testID: counterTestId } : {})} style={[styles.counterText, { color: inputTextColor }]}>
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

