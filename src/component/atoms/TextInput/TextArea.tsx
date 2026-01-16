import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
    TextInput as RNTextInput,
    View,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    TextInputProps,
} from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { useFont } from "@core/util/fonts/FontContext";

type AreaType = "text" | "number" | "decimal" | "phone" | "email" | "url" | "password";

export type TextAreaRef = {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    isFocused: () => boolean;
};

export interface TextAreaProps extends Omit<TextInputProps, "style"> {
    value?: string;
    onChangeText?: (val: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    helperText?: string;
    error?: boolean | string;
    editable?: boolean;
    rows?: number; // number of lines visible
    width?: number | string;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    testID?: string;
    type?: AreaType;
}

const DEFAULT_WIDTH = 358;
const DEFAULT_ROWS = 4;
// const DEFAULT_HEIGHT = 120;

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
    const {
        value,
        defaultValue,
        onChangeText,
        placeholder,
        label,
        required = false,
        helperText,
        error,
        editable = true,
        rows = DEFAULT_ROWS,
        width = DEFAULT_WIDTH,
        height = undefined,
        minWidth = 84,
        maxWidth = 800,
        containerStyle,
        inputStyle,
        testID,
        type = "text",
        maxLength,
        ...rest
    } = props;

    const theme = useTheme();
    const font = useFont();
    const internalRef = useRef<RNTextInput | null>(null);
    const [internalValue, setInternalValue] = useState<string>(value ?? defaultValue ?? "");
    const [_focused, setFocused] = useState(false);

    React.useEffect(() => {
        if (typeof value === "string") setInternalValue(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
        focus: () => internalRef.current?.focus(),
        blur: () => internalRef.current?.blur(),
        clear: () => {
            internalRef.current?.clear();
            setInternalValue("");
            onChangeText?.("");
        },
        isFocused: () => internalRef.current?.isFocused() ?? false,
    }));

    const handleChangeText = (txt: string) => {
        if (value === undefined) setInternalValue(txt);
        onChangeText?.(txt);
    };

    // disabled vs normal backgrounds & text colors follow TextInput rules
    const background = !editable
        ? (theme.background01 ? theme.background01(75) : theme.light ?? "#fff")
        : (theme.background01 ? theme.background01(100) : theme.light ?? "#fff");

    const errorColor = theme.negative ? theme.negative(100) : "#AF183C";
    const borderColor = error ? errorColor : (theme.secondary01 ? theme.secondary01(100) : "#E9EEF3");

    const disabledTextColor = theme.text01 ? theme.text01(75) : "#8A96A3";
    const normalTextColor = theme.text01 ? theme.text01(100) : "#1F2933";
    const baseTextColor = !editable ? disabledTextColor : normalTextColor;

    const inputTextColor = error ? errorColor : baseTextColor;
    const labelColor = error ? errorColor : baseTextColor;

    const hasTestId = typeof testID === "string" && testID.length > 0;
    const containerTestId = hasTestId ? `${testID}-container` : undefined;
    const inputTestId = hasTestId ? `${testID}-input` : undefined;
    const labelTestId = hasTestId ? `${testID}-label` : undefined;
    const helperTestId = hasTestId ? `${testID}-helper` : undefined;

    const typeToKeyboard: Record<AreaType, TextInputProps["keyboardType"]> = {
        text: "default",
        number: "numeric",
        decimal: "decimal-pad",
        phone: "phone-pad",
        email: "email-address",
        password: "default",
        url: "url",
    };

    const finalKeyboard = (rest as any).keyboardType ?? typeToKeyboard[type];
    const finalSecure = (rest as any).secureTextEntry ?? false;

    return (
        <View
            {...(containerTestId ? { testID: containerTestId } : {})}
            style={[styles.wrapper, { width, minWidth, maxWidth }, containerStyle as any]}
        >
            {label ? (
                <Text {...(labelTestId ? { testID: labelTestId } : {})} style={[styles.label, { color: labelColor }]}>
                    {label}
                    {required ? <Text style={[styles.required, { color: labelColor }]}>*</Text> : null}
                </Text>
            ) : null}

            <View style={[styles.areaContainer, { backgroundColor: background, borderColor }]}>
                <RNTextInput
                    {...(inputTestId ? { testID: inputTestId } : {})}
                    ref={internalRef}
                    multiline
                    numberOfLines={rows}
                    style={[
                        styles.input,
                        {
                            color: inputTextColor,
                            fontFamily: font?.regular,
                            height: height ?? rows * 24, // simple height heuristic
                        } as TextStyle,
                        inputStyle,
                    ]}
                    value={internalValue}
                    defaultValue={defaultValue}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={typeof baseTextColor === "string" ? `${baseTextColor}99` : "#8A96A3"}
                    keyboardType={finalKeyboard}
                    secureTextEntry={finalSecure}
                    editable={editable}
                    onFocus={(e) => {
                        setFocused(true);
                        (rest as any).onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        (rest as any).onBlur?.(e);
                    }}
                    {...rest}
                    maxLength={maxLength}
                />
            </View>

            <View style={styles.metaRow}>
                <Text {...(helperTestId ? { testID: helperTestId } : {})} style={[styles.helperText, { color: error ? errorColor : "#8A96A3" }]}>
                    {error ? (typeof error === "string" ? error : helperText ?? "") : helperText ?? ""}
                </Text>
                {/* counter intentionally omitted for textarea by default */}
                {typeof maxLength === "number" ? (
                    <Text style={[styles.helperText, { color: "#8A96A3" }]}>
                        {internalValue.length}/{maxLength}
                    </Text>
                ) : null}
            </View>
        </View>
    );
});

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
    areaContainer: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    } as ViewStyle,
    input: {
        fontSize: 16,
        padding: 0,
        textAlignVertical: "top", // important for multiline on Android
    } as TextStyle,
    metaRow: {
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
    } as ViewStyle,
    helperText: {
        fontSize: 12,
    } as TextStyle,
});


