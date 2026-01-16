import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { P, H5 } from '@components/atoms/Typhography/variants';
import { useTheme } from '@core/util/Theme/ThemeContext';

type Props = {
    label: string;
    value: string;
    onPress?: () => void;
    style?: any;
};

const SelectField: React.FC<Props> = ({ label, value, onPress, style }) => {
    const theme: any = useTheme();
    const bg = theme.background01 ? theme.background01(100) : '#0B1220';
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.wrap, style, { backgroundColor: bg }]}>
            <View style={styles.left}>
                <P themeToken="text02" style={styles.label}>{label}</P>
                <H5 themeToken="text01" style={styles.value}>{value}</H5>
            </View>
            <Icon name="chevron-down" size={20} color={theme.text02 ? theme.text02(100) : '#9AA6B2'} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrap: { borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    left: { flex: 1 },
    label: { marginBottom: 6 },
    value: {},
});

export default SelectField;
