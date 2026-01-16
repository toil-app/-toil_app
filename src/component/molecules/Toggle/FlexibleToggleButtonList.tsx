import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ToggleButton } from '../../atoms/Button/ToggleButton';

export type Option = { key: string; label: string };

export type FlexibleProps = {
    options?: Option[];
    selectedKey?: string; // controlled
    defaultSelectedKey?: string; // uncontrolled
    onChange?: (key: string) => void;
    disabled?: boolean;
    style?: any;
    spacing?: number;
};

export const FlexibleToggleButtonList: React.FC<FlexibleProps> = ({
    options = [
        { key: 'one', label: 'One' },
        { key: 'two', label: 'Two' },
        { key: 'three', label: 'Three' },
    ],
    selectedKey,
    defaultSelectedKey,
    onChange,
    disabled = false,
    style,
    spacing = 8,
}) => {
    const [internalSelected, setInternalSelected] = useState<string | undefined>(defaultSelectedKey);
    const isControlled = typeof selectedKey !== 'undefined';
    const current = isControlled ? selectedKey : internalSelected;

    const handleChange = useCallback(
        (key: string) => {
            if (disabled) return;
            if (!isControlled) setInternalSelected(key);
            onChange?.(key);
        },
        [disabled, isControlled, onChange]
    );

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.container, style]}>
            {options.map((opt, idx) => (
                <View key={opt.key} style={[idx < options.length - 1 ? { marginRight: spacing } : undefined]}>
                    <ToggleButton
                        label={opt.label}
                        selected={current === opt.key}
                        onChange={(selected) => {
                            // If ToggleButton toggles to selected true, then mark this key as selected.
                            if (selected) handleChange(opt.key);
                            else {
                                // If the user toggles an already-selected button off, clear selection when uncontrolled.
                                if (!isControlled) setInternalSelected(undefined);
                                onChange?.("");
                            }
                        }}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingHorizontal: 8 },
});

export default FlexibleToggleButtonList;
