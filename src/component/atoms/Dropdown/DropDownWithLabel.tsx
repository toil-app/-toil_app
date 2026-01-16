import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Dropdown, { Props as DropdownProps } from './Dropdown';
import TextInputLable from '@components/atoms/label/TextInputLable';
import { useTheme } from '@core/util/Theme/ThemeContext';


export type DropDownProps = DropdownProps & {
    label?: React.ReactNode;
    required?: boolean;
    error?: boolean | string;
    editable?: boolean;
    containerStyle?: ViewStyle;
};

const DropDownWithLabel: React.FC<DropDownProps> = ({ label, required = false, error = false, editable = true, containerStyle, ...dropdownProps }) => {
    const theme: any = useTheme();
    const borderColor = theme.secondary01 ? theme.secondary01(100) : "#E9EEF3";
    const triggerBg = typeof theme.background01 === "function" ? theme.background01(50) : theme.light ?? "#fff";


    return (
        <View style={containerStyle}>
            <View style={[styles.wrapper, { borderWidth: 1, borderColor: borderColor, borderRadius: 12, padding: 8, backgroundColor: triggerBg }]}>
                {label ? (
                    <TextInputLable label={label} required={required} error={Boolean(error)} editable={editable} style={styles.label} />
                ) : null}

                <Dropdown borderWidth={0} {...dropdownProps} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    } as ViewStyle,
    label: {
        marginBottom: 6,
        textTransform: 'uppercase',
    } as ViewStyle,
});

export default DropDownWithLabel;