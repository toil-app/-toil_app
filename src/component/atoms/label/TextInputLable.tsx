import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';

interface Props {
    label?: React.ReactNode;
    required?: boolean;
    optional?: boolean;
    optionalLabel?: string;
    testID?: string;
    style?: TextStyle | Array<TextStyle>;
    requiredStyle?: TextStyle | Array<TextStyle>;
    optionalStyle?: TextStyle | Array<TextStyle>;
    editable?: boolean;
    error?: boolean | string;
}

const TextInputLable: React.FC<Props> = ({
    label,
    required = false,
    optional = false,
    optionalLabel = 'Optional',
    testID,
    style,
    requiredStyle,
    optionalStyle,
    editable = true,
    error = false
}) => {
    const theme = useTheme();

    if (!label) return null;

    const errorColor = theme.negative ? theme.negative(100) : '#AF183C';
    const disabledTextColor = theme.text01 ? theme.text01(75) : '#8A96A3';
    const normalTextColor = theme.text01 ? theme.text01(100) : '#1F2933';
    const baseTextColor = !editable ? disabledTextColor : normalTextColor;
    const labelColor = error ? errorColor : baseTextColor;
    const optionalColor = theme.text02 ? theme.text02(75) : '#9CA3AF';

    return (
        <Text {...(testID ? { testID } : {})} style={[styles.label, style, { color: labelColor }]}>
            {label}
            {required ? <Text style={[styles.required, requiredStyle, { color: labelColor }]}>*</Text> : null}
            {optional ? <Text style={[styles.optionalText, optionalStyle, { color: optionalColor }]}>   ({optionalLabel})</Text> : null}
        </Text>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '600',
    } as TextStyle,
    required: {
        marginLeft: 4,
    } as TextStyle,
    optionalText: {
        fontSize: 12,
        fontWeight: '400',
    } as TextStyle,
});

export default TextInputLable;
