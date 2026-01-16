import React, { useState, useCallback, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList, ViewStyle, Image } from "react-native";
import { P } from "../Typhography/variants";
import { Icons } from "@assets/icons";
import { useTheme, } from "@core/util/Theme/ThemeContext";
import { relativeHeight } from "@core/util/Theme/layout";
import { ThemeMode } from "@core/util/Theme";
// arrow assets — adjust paths if your assets live elsewhere

export type DropdownItem = {
    id: string | number;
    label?: string;
    type?: string;
    testID?: string;
    [key: string]: any;
};

export type Props = {
    items: DropdownItem[];
    value?: string | number; // controlled selected id
    defaultValue?: string | number; // uncontrolled initial
    onChange?: (item: DropdownItem) => void;
    placeholder?: string;
    disabled?: boolean;
    style?: ViewStyle;
    listStyle?: ViewStyle;
    itemStyle?: ViewStyle;
    testID?: string;
    boxHeight?: number;
    borderWidth?: number;
    // optional render function for item label if custom
    renderLabel?: (item: DropdownItem) => React.ReactNode;
};

const Dropdown: React.FC<Props> = ({
    items,
    value,
    defaultValue,
    onChange,
    placeholder = "Select",
    disabled = false,
    style,
    listStyle,
    itemStyle,
    testID,
    renderLabel,
    boxHeight,
    borderWidth = 1,
}) => {
    const theme: any = useTheme();

    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);

    const isControlled = typeof value !== "undefined";
    const selectedId = isControlled ? value : internalValue;

    const selectedItem = useMemo(() => items.find((it) => it.id === selectedId), [items, selectedId]);
    const borderColor = theme.secondary01 ? theme.secondary01(100) : "#E9EEF3";


    const toggle = useCallback(() => {
        if (disabled) return;
        setOpen((s) => !s);
    }, [disabled]);

    const handleSelect = useCallback(
        (item: DropdownItem) => {
            if (disabled) return;
            if (!isControlled) setInternalValue(item.id);
            onChange?.(item);
            setOpen(false);
        },
        [disabled, isControlled, onChange]
    );

    // theme tokens
    const triggerBg = typeof theme.background01 === "function" ? theme.background01(100) : theme.light ?? "#fff";
    const listBg = typeof theme.background01 === "function" ? theme.background01(75) : theme.surface ?? "#f7f7f8";
    const selectedItemBg = typeof theme.background01 === "function" ? theme.primary01(100) : theme.dark ?? "#000";
    // const selectedTextColor = typeof theme.text01 === "function" ? theme.text01(100) : theme.dark ?? "#000";
    // const defaultTextColor = typeof theme.text02 === "function" ? theme.text02(50) ?? theme.text02(100) : theme.muted ?? "#6c757d";

    // choose arrow based on theme.mode (ThemeMode.LIGHT -> black, else white)
    const arrowSource = (theme?.mode === ThemeMode.LIGHT || theme?.mode === "light") ? Icons['sa_down_arrow_black'] : Icons['sa_down_arrow_white'];
    // keep original image colors; use tintColor if you prefer to color it via tint

    return (
        <View style={[styles.wrapper, style]}>
            <TouchableOpacity
                testID={testID}
                accessible
                accessibilityRole="button"
                accessibilityState={{ disabled, expanded: open }}
                activeOpacity={disabled ? 1 : 0.8}
                onPress={toggle}
                style={[
                    styles.trigger,
                    {
                        backgroundColor: triggerBg,
                        borderRadius: typeof theme.radii?.md === "number" ? theme.radii.md : 8,
                        paddingHorizontal: typeof theme.spacing?.md === "number" ? theme.spacing.md : 12,
                        height: relativeHeight(boxHeight ? boxHeight : 44),
                        // layout: label left, arrow right
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderWidth: borderWidth,
                        borderColor: disabled ? (theme.muted ?? "#ccc") : borderColor,
                    } as ViewStyle,
                ]}
            >
                <P
                    themeToken={selectedItem ? "text01" : "text02"}
                    themeShade={selectedItem ? 100 : 50}
                    style={{ textAlign: "left", flex: 1 }}
                >
                    {selectedItem ? selectedItem.label ?? String(selectedItem.id) : placeholder}
                </P>

                <Image
                    source={arrowSource}
                    style={{
                        width: 16,
                        height: 16,
                        marginLeft: 12,
                        transform: [{ rotate: open ? "180deg" : "0deg" }],
                    }}
                // optional: tintColor can be applied if using monochrome PNG/SVG and you want theme coloring
                // tintColor={arrowTint}
                />
            </TouchableOpacity>

            {open ? (
                <View
                    style={[
                        styles.list,
                        {
                            backgroundColor: listBg,
                            borderRadius: typeof theme.radii?.md === "number" ? theme.radii.md : 8,
                            paddingVertical: typeof theme.spacing?.xs === "number" ? theme.spacing.xs : 6,
                        } as ViewStyle,
                        listStyle,
                    ]}
                >
                    <FlatList
                        data={items}
                        keyExtractor={(it) => String(it.id)}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <TouchableOpacity
                                    testID={item.testID}
                                    activeOpacity={0.8}
                                    onPress={() => handleSelect(item)}
                                    style={[
                                        styles.item,
                                        itemStyle,
                                        {
                                            paddingHorizontal: typeof theme.spacing?.md === "number" ? theme.spacing.md : 12,
                                            paddingVertical: typeof theme.spacing?.xs === "number" ? theme.spacing.xs : 8,
                                            backgroundColor: isSelected ? selectedItemBg : "transparent",
                                        } as ViewStyle,
                                    ]}
                                >
                                    {renderLabel ? (
                                        renderLabel(item)
                                    ) : (
                                        <P themeToken={isSelected ? "text01" : "text01"} themeShade={isSelected ? 10 : 100} style={{ textAlign: "left" }}>
                                            {item.label ?? String(item.id)}
                                        </P>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
                    />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },
    trigger: {
        alignSelf: "stretch",
    } as ViewStyle,
    list: {
        marginTop: 8,
        maxHeight: 240,
        overflow: "hidden",
    } as ViewStyle,
    item: {
        alignSelf: "stretch",
    } as ViewStyle,
});

export default Dropdown;
