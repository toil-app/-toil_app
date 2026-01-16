import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, I18nManager, TextStyle, ViewStyle, TouchableWithoutFeedback } from 'react-native';
// use require to avoid missing type declarations in projects without @types/react-native-animatable
const Animatable: any = require('react-native-animatable');

export type OTPRef = {
    focus: () => void;
    blur: () => void;
    clear: () => void;
};

export type OTPProps = {
    value?: string;
    codeLength?: number;
    cellSize?: number;
    cellSpacing?: number;
    placeholder?: string | React.ReactElement;
    password?: boolean;
    mask?: string | React.ReactElement;
    maskDelay?: number;
    keyboardType?: string;
    autoFocus?: boolean;
    restrictToNumbers?: boolean;
    containerStyle?: ViewStyle | ViewStyle[];
    cellStyle?: ViewStyle | ViewStyle[];
    cellStyleFocused?: ViewStyle | ViewStyle[];
    cellStyleFilled?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    textStyleFocused?: TextStyle | TextStyle[];
    animationFocused?: string | object;
    animated?: boolean;
    editable?: boolean;
    inputProps?: any;
    disableFullscreenUI?: boolean;
    onFulfill?: (code: string) => void;
    onChangeText?: (code: string) => void;
    onBackspace?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
};

const defaultProps: Partial<OTPProps> = {
    value: '',
    codeLength: 6,
    cellSize: 56,
    cellSpacing: 12,
    placeholder: '',
    password: false,
    mask: '•',
    maskDelay: 200,
    keyboardType: 'numeric',
    autoFocus: false,
    restrictToNumbers: true,
    animationFocused: 'pulse',
    animated: true,
    editable: true,
    inputProps: {},
    disableFullscreenUI: true,
};

const styles = StyleSheet.create({
    containerDefault: {
        alignItems: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },
    cellWrapper: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
    },
    cellBase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    hiddenInput: {
        flex: 1,
        opacity: 0,
        textAlign: 'center',
    },
    hiddenInputOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

const OTPTextInput = React.forwardRef<OTPRef, OTPProps>((propsIn, ref) => {
    const props = { ...defaultProps, ...propsIn } as OTPProps;
    const {
        value = '',
        codeLength = 6,
        cellSize,
        cellSpacing,
        placeholder,
        password,
        mask,
        maskDelay,
        autoFocus,
        restrictToNumbers,
        cellStyle,
        cellStyleFocused,
        cellStyleFilled,
        textStyle,
        textStyleFocused,
        animationFocused,
        animated,
        editable,
        inputProps,
        disableFullscreenUI,
    } = props;

    const [maskDelayState, setMaskDelayState] = useState<boolean>(false);
    const [focused, setFocused] = useState(false);
    const animRef = useRef<any>(null);
    const inputRef = useRef<TextInput | null>(null);
    const maskTimeout = useRef<number | null>(null);
    const sz = Number(cellSize) || 56;
    const cs = Number(cellSpacing) || 12;

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        clear: () => inputRef.current?.clear(),
    }));

    useEffect(() => {
        return () => {
            if (maskTimeout.current) {
                clearTimeout(maskTimeout.current);
            }
        };
    }, []);

    // animation helper intentionally omitted if not needed; Animatable refs are used directly on focused cell

    const handleChange = (text: string) => {
        let code = text;
        if (restrictToNumbers) {
            const matched = code.match(/[0-9]/g) || [];
            code = matched.join('');
        }
        props.onChangeText && props.onChangeText(code);
        if (code.length === codeLength && props.onFulfill) props.onFulfill(code);

        const shouldMask = !!(password && code.length > (propsIn.value ? propsIn.value.length : 0));
        setMaskDelayState(shouldMask);
        if (shouldMask) {
            if (maskTimeout.current) clearTimeout(maskTimeout.current);
            maskTimeout.current = (setTimeout(() => setMaskDelayState(false), maskDelay) as unknown) as number;
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!value && props.onBackspace) props.onBackspace();
        }
    };

    const onFocused = () => {
        setFocused(true);
        props.onFocus && props.onFocus();
    };

    const onBlurred = () => {
        setFocused(false);
        props.onBlur && props.onBlur();
    };

    const renderCells = () => {
        return Array.from({ length: codeLength }).map((_, idx) => {
            const cellFocused = focused && idx === value.length;
            const filled = idx < value.length;
            const last = idx === value.length - 1;
            const showMask = filled && (password && (!maskDelayState || !last));
            const isPlaceholderText = typeof placeholder === 'string';
            const isMaskText = typeof mask === 'string';
            const pinCodeChar = value.charAt(idx);

            let cellText: string | null = null;
            if (filled || placeholder !== null) {
                if (showMask && isMaskText) {
                    cellText = mask as string;
                } else if (!filled && isPlaceholderText) {
                    cellText = placeholder as string;
                } else if (pinCodeChar) {
                    cellText = pinCodeChar;
                }
            }

            const placeholderComponent = !isPlaceholderText ? placeholder : null;
            const maskComponent = showMask && !isMaskText ? (mask as React.ReactElement) : null;
            const isCellText = typeof cellText === 'string';

            return (
                <Animatable.View
                    key={idx}
                    ref={idx === value.length ? animRef : undefined}
                    style={[
                        styles.cellBase,
                        { width: sz, height: sz, marginLeft: cs / 2, marginRight: cs / 2 },
                        cellStyle,
                        cellFocused ? cellStyleFocused : {},
                        filled ? cellStyleFilled : {},
                    ]}
                    animation={idx === value.length && focused && animated ? animationFocused : undefined}
                    iterationCount="infinite"
                    duration={500}
                >
                    {isCellText && !maskComponent && <Text style={[textStyle, cellFocused ? textStyleFocused : {}]}>{cellText}</Text>}
                    {(!isCellText && !maskComponent) && placeholderComponent}
                    {isCellText && maskComponent}
                </Animatable.View>
            );
        });
    };

    const focusHiddenInput = () => {
        inputRef.current?.focus();
    };

    return (
        <TouchableWithoutFeedback onPress={focusHiddenInput} accessible={false}>
            <Animatable.View
                ref={animRef}
                style={[
                    styles.containerDefault,
                    { width: (Number(cellSize) || 0) * codeLength + (Number(cellSpacing) || 0) * (codeLength - 1), height: Number(cellSize) || 0 },
                    props.containerStyle,
                ]}
            >
                <View style={styles.cellWrapper}>
                    {renderCells()}
                </View>
                <TextInput
                    disableFullscreenUI={disableFullscreenUI}
                    value={value}
                    ref={r => (inputRef.current = r)}
                    onChangeText={handleChange}
                    onKeyPress={handleKeyPress}
                    onFocus={onFocused}
                    onBlur={onBlurred}
                    spellCheck={false}
                    autoFocus={autoFocus}
                    keyboardType={props.keyboardType as any}
                    numberOfLines={1}
                    caretHidden
                    maxLength={codeLength}
                    selection={{ start: value.length, end: value.length }}
                    style={[styles.hiddenInput, styles.hiddenInputOverlay]}
                    editable={editable}
                    testID={inputProps?.testID || undefined}
                    {...inputProps}
                />
            </Animatable.View>
        </TouchableWithoutFeedback>
    );
});

export default OTPTextInput;
