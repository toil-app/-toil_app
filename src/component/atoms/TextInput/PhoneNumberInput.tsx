import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput as RNTextInput,
    StyleSheet,
    Platform,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useFont } from '@core/util/fonts/FontContext';
import CountryPicker, { getAllCountries } from '../CountryPicker/components/CountryPicker';
import { DEFAULT_COUNTRY_CODE } from '@core/util/constant/constant';

export type PhoneInputRef = {
    focus: () => void;
    blur: () => void;
    clear: () => void;
    isFocused: () => boolean;
};

export interface PhoneNumberInputProps {
    value?: string;
    onChangeText?: (internationalNumber: string, localNumber: string, countryCode: string, callingCode: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string | boolean;
    helperText?: string;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    countryCode?: string;
    onChangeCountry?: (country: any) => void;
    showCountrySelector?: boolean;
    maxLength?: number;
    testID?: string;
    helperTestId?: string;
    counterTestId?: string;
}

const DEFAULT_COUNTRY = DEFAULT_COUNTRY_CODE;

const PhoneNumberInput = forwardRef<PhoneInputRef, PhoneNumberInputProps>((props, ref) => {
    const {
        value = '',
        onChangeText,
        placeholder = 'Phone number',
        disabled = false,
        error = false,
        helperText,
        style,
        inputStyle,
        countryCode = DEFAULT_COUNTRY,
        onChangeCountry,
        maxLength,
        testID,
        helperTestId,
        counterTestId,
    } = props;

    const theme = useTheme();
    const font = useFont();

    const inputRef = useRef<RNTextInput | null>(null);
    const [internalValue, setInternalValue] = useState<string>(value);
    const [selectedCCA2, setSelectedCCA2] = useState<string>(countryCode);
    const [callingCode, setCallingCode] = useState<string>('44');

    // expose ref methods
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        clear: () => {
            setInternalValue('');
            onChangeText?.(`+${callingCode}`, '', selectedCCA2, callingCode);
            inputRef.current?.clear();
        },
        isFocused: () => inputRef.current?.isFocused() ?? false,
    }));

    // sync controlled value
    useEffect(() => {
        if (typeof value === 'string') setInternalValue(value);
    }, [value]);

    // initialize calling code from countries dataset if available
    useEffect(() => {
        try {
            const all = getAllCountries();
            const found = all.find(c => c.cca2 && c.cca2.toUpperCase() === (countryCode || DEFAULT_COUNTRY).toUpperCase());
            if (found && found.callingCode) {
                setCallingCode(String(found.callingCode));
            }
        } catch {
            // noop — keep fallback
        }
    }, [countryCode]);

    const handleLocalChange = (text: string) => {
        // allow only digits
        const digits = text.replace(/[^0-9]/g, '');
        if (maxLength && digits.length > maxLength) return;
        setInternalValue(digits);
        const international = `+${callingCode}${digits}`;
        onChangeText?.(international, digits, selectedCCA2, callingCode);
    };

    const handleCountryChange = (country: any) => {
        if (!country) return;
        const code = country.callingCode ? String(country.callingCode) : callingCode;
        setSelectedCCA2(country.cca2 || selectedCCA2);
        setCallingCode(code);
        onChangeCountry?.(country);
        onChangeText?.(`+${code}${internalValue}`, internalValue, country.cca2 || selectedCCA2, code);
    };

    const containerBg = theme?.background01 ? theme.background01(100) : '#fff';
    const textColor = theme?.text01 ? theme.text01(100) : '#111';
    const placeholderColor = theme?.text01 ? theme.text01(75) : '#888';
    const negativeColor = theme?.negative ? theme.negative(100) : '#AF183C';
    const helperTextColor = theme?.text01 ? theme.text01(75) : '#8A96A3';
    const errorColor = error ? negativeColor : helperTextColor;

    return (
        <View style={[styles.wrapper, style]} {...(testID ? { testID } : {})}>
            <View style={[styles.innerRow, { backgroundColor: containerBg, borderColor: error ? negativeColor : (theme?.secondary01 ? theme.secondary01(100) : '#E9EEF3') }]}>
                <CountryPicker
                    cca2={selectedCCA2}
                    onChange={(c: any) => handleCountryChange(c)}
                    closeable
                    filterable
                    hideAlphabetFilter
                    transparent={false}
                    showCallingCode={true}
                    hideCountryFlag={false}
                    showCountryNameWithFlag={true}
                />

                <RNTextInput
                    ref={inputRef}
                    style={[styles.input, { color: textColor, fontFamily: font?.regular }, inputStyle]}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    onChangeText={handleLocalChange}
                    value={internalValue}
                    editable={!disabled}
                    maxLength={maxLength}
                    returnKeyType="done"
                />
            </View>
            {(error || helperText || maxLength) && (
                <View style={styles.metaRow}>
                    <Text
                        {...(helperTestId ? { testID: helperTestId } : {})}
                        style={[styles.helperText, { color: error ? errorColor : helperTextColor }]}
                    >
                        {error ? (typeof error === 'string' ? error : helperText ?? '') : helperText ?? ''}
                    </Text>
                    {typeof maxLength === 'number' ? (
                        <Text
                            {...(counterTestId ? { testID: counterTestId } : {})}
                            style={[styles.counterText, { color: textColor }]}
                        >
                            {(internalValue ?? '').length}/{maxLength}
                        </Text>
                    ) : null}
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 48,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: Platform.OS === 'android' ? 6 : 10,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    helperText: {
        flex: 1,
        fontSize: 12,
    },
    counterText: {
        fontSize: 12,
        marginLeft: 8,
    },
});

export default PhoneNumberInput;
