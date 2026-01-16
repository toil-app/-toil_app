import React from 'react';
import { View, StyleSheet } from 'react-native';
import { P, H4, H5 } from '@components/atoms/Typhography/variants';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';



type Props = {
    amount: string;
    periodLabel?: string;
    note?: string;
    style?: any;
    bgShadow?: number;
};

const EstimatedTotalCard: React.FC<Props> = ({ amount, periodLabel, note, style, bgShadow }) => {
    const { t } = useTranslation();
    const theme: any = useTheme();
    const bg = theme.background01 ? theme.background01(bgShadow || 100) : '#0B1220';
    return (
        <View style={[styles.wrap, style, { backgroundColor: bg }]}>
            <View style={styles.left}>
                <H5 themeToken="text01" style={[styles.textAlignLeft, { color: theme.primary01 ? theme.primary01(100) : '#0B1220', fontWeight: 'bold', textTransform: 'uppercase' }]}>{t('estimated_total')}</H5>
                <P style={styles.textAlignLeft} themeShade={50} themeToken="text02">{note || 'Base rate × Members × Time'}</P>
            </View>
            <View style={styles.right}>
                <H4 themeToken="text01">{amount}</H4>
                <P style={{ color: theme.primary01 ? theme.primary01(100) : '#0B1220' }}>{periodLabel || 'Total for period'}</P>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: { borderRadius: 12, padding: 16, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    left: { flex: 1 },
    right: { alignItems: 'flex-end' },
    textAlignLeft: { textAlign: 'left' },
});

export default EstimatedTotalCard;
