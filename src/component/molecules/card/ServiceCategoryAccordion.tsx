import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from '@components/atoms/Checkbox/Checkbox';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { P, H5 } from '@components/atoms/Typhography/variants';
import Icon from 'react-native-vector-icons/Ionicons';

export type ServiceItem = { id: string; label: string; selected?: boolean };

export type Props = {
    id: string;
    title: string;
    iconName?: string; // Ionicons name
    items?: ServiceItem[];
    defaultExpanded?: boolean;
    onCategoryChange?: (checked: boolean) => void;
    onItemToggle?: (itemId: string, checked: boolean) => void;
    // emits current selection state for the whole category
    onSelectionChange?: (categoryId: string, items: ServiceItem[]) => void;
};

const ServiceCategoryAccordion: React.FC<Props> = ({ id, title, iconName, items = [], defaultExpanded = false, onCategoryChange, onItemToggle, onSelectionChange }) => {
    const theme: any = useTheme();
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
    // initialize checked based on whether any sub-item is selected
    const [localItems, setLocalItems] = useState<ServiceItem[]>(items);
    const [checked, setChecked] = useState<boolean>(() => !!items.find(it => it.selected));

    const toggleCategory = () => {
        const next = !checked;
        // update all items to next
        const newItems = localItems.map(it => ({ ...it, selected: next }));
        setLocalItems(newItems);
        setChecked(next);
        onCategoryChange?.(next);
        onSelectionChange?.(id, newItems);
    };

    const toggleItem = (itemId: string) => {
        setLocalItems(prev => {
            const next = prev.map(it => it.id === itemId ? { ...it, selected: !it.selected } : it);
            // ensure category checked reflects items (checked if any selected)
            const anySelected = next.some(it => it.selected);
            setChecked(anySelected);
            // emit selection change
            onSelectionChange?.(id, next);
            return next;
        });

        // call item-level callback with the toggled value (read from current localItems)
        const found = localItems.find(it => it.id === itemId);
        onItemToggle?.(itemId, !(found?.selected));
    };

    const borderColor = typeof theme.background01 === 'function' ? theme.background01(100) : '#ccc';
    const containerBorderStyle = { borderColor };

    return (
        <View style={[styles.container, containerBorderStyle]}>
            <TouchableOpacity activeOpacity={0.8} style={styles.header} onPress={() => setExpanded(!expanded)}>
                <View style={styles.leftRow}>
                    <Checkbox checked={checked} onChange={toggleCategory} />
                    {iconName ? <Icon name={iconName} size={18} color={theme.text01 ? theme.text01(100) : '#fff'} style={styles.icon} /> : null}
                    <H5 themeToken='text01' style={styles.title}>{title}</H5>
                </View>
                <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={theme.text02 ? theme.text02(75) : '#9aa6b6'} />
            </TouchableOpacity>

            {expanded ? (
                <View style={styles.body}>
                    <P themeShade={125} themeToken='text02' style={styles.availableLabel}>Available Services</P>
                    {localItems.map(it => (
                        <TouchableOpacity key={it.id} style={[styles.itemRow]} activeOpacity={0.8} onPress={() => toggleItem(it.id)}>
                            <View style={styles.itemInner}>
                                <P size={14} themeShade={50}>{it.label}</P>
                                <Checkbox checked={!!it.selected} onChange={() => toggleItem(it.id)} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderWidth: 1, borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'transparent' },
    leftRow: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginLeft: 8, marginRight: 8 },
    title: { marginLeft: 8 },
    body: { padding: 12, paddingTop: 6 },
    availableLabel: { marginBottom: 8, fontWeight: '700', textTransform: 'uppercase', textAlign: 'left' },
    itemRow: { marginBottom: 8 },
    itemInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'transparent' },
});

export default ServiceCategoryAccordion;
