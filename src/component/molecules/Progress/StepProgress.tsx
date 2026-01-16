import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { P } from '@components/atoms/Typhography/variants';
import { Progressbar } from '@components/atoms/Progressbar';

type Props = {
    step: number;
    total: number;
    value?: number; // progress value (defaults to step)
    height?: number;
    showLabel?: boolean;
    style?: ViewStyle;
};

const StepProgress: React.FC<Props> = ({ step, total, value, height = 8, showLabel = false, style }) => {
    const { t } = useTranslation();
    const progressValue = typeof value === 'number' ? value : step;

    return (
        <View style={[styles.row, style]}>
            <P themeShade={50} themeToken="text02" style={styles.stepLabel}>{t('step_of', { step, total })}</P>
            <Progressbar value={progressValue} max={total} height={height} showLabel={showLabel} />
        </View>
    );
};

const styles = StyleSheet.create({
    row: { width: '100%' },
    stepLabel: { marginBottom: 8, textAlign: 'left' },
});

export default StepProgress;
