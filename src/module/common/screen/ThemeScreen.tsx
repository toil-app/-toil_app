import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '@core/util/Theme/ThemeModeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { H5 } from '@components/atoms';
import SettingListItem from '../../../component/molecules/SettingListItem/SettingListItem';
import { AuthHeader } from '@components/organisms/header';

const ThemeScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const { mode: selected, setMode } = useThemeMode();

    const dynamic = StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background02 ? theme.background02(100) : '#081421' },
        container: { padding: 20 },
        intro: { marginBottom: 18 },
        card: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#0b1220', backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220' },
        optionWrap: { paddingHorizontal: 12 },
        selectedOutline: { borderWidth: 2, borderColor: theme.primary01 ? theme.primary01(100) : '#3b82f6', borderRadius: 12 },
        headerStyle: { textAlign: 'left' as const },
        titleStyle: { fontSize: 28 },
        introText: { marginTop: 8, color: theme.text02 ? theme.text02(60) : '#9aa6b3' },
        marginTop: { marginTop: 20, marginBottom: 20 }
    });

    const options: Array<{ key: 'light' | 'dark' | 'system'; title: string; subtitle: string; icon: string, iconColor: string }> = [
        { key: 'light', title: t('theme_light'), subtitle: t('theme_light_sub'), icon: 'white-balance-sunny', iconColor: '#f59e0b' },
        { key: 'dark', title: t('theme_dark'), subtitle: t('theme_dark_sub'), icon: 'weather-night', iconColor: '#1e40af' },
        { key: 'system', title: t('theme_system'), subtitle: t('theme_system_sub'), icon: 'cellphone', iconColor: '#4b5563' },
    ];

    const handleOptionPress = (key: 'light' | 'dark' | 'system') => {
        setMode(key);
    };

    return (
        <SafeAreaView style={dynamic.screen}>
            <ScrollView contentContainerStyle={dynamic.container}>
                {/* <H4 style={dynamic.headerStyle}>{t('change_theme') || 'Theme'}</H4>

                <View style={dynamic.intro}>
                    <H4 style={dynamic.titleStyle}>{t('theme_choose_appearance')}</H4>
                    <P style={dynamic.introText}>{t('theme_intro')}</P>
                </View> */}
                <AuthHeader
                    onBack={() => { }}
                    title={t('change_theme') || 'Theme'} />

                <View style={dynamic.marginTop}>
                    <H5>{t('theme_choose_appearance')}</H5>
                </View>

                <View style={dynamic.card}>
                    {options.map((o) => {
                        const isSelected = selected === o.key;
                        return (
                            <TouchableOpacity key={o.key} onPress={() => handleOptionPress(o.key)} activeOpacity={0.8} style={[dynamic.optionWrap, isSelected ? dynamic.selectedOutline : undefined]}>
                                <SettingListItem
                                    iconColor={o.iconColor}
                                    icon={o.icon}
                                    title={o.title}
                                    subtitle={o.subtitle}
                                    iconBgStyle={{ backgroundColor: isSelected ? (theme.background02 ? theme.background02(100) : '#0ea5e9') : (theme.background02 ? theme.background02(25) : '#071723') }}
                                    rightComponent={isSelected ? <Icon name="check-circle" size={20} color={theme.primary01 ? theme.primary01(100) : '#60a5fa'} /> : null}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ThemeScreen;
