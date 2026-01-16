import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { SearchTextInput } from '@components/atoms/TextInput/SearchTextInput';
import { useTheme } from '@core/util/Theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingListItem from '../../../component/molecules/SettingListItem/SettingListItem';
import { H4 } from '@components/atoms';
import { AuthHeader } from '@components/organisms/header';
import { SUGGESTED_LANGS, ALL_LANGS, Lang as LangDef } from '@core/util/languages';

type Lang = LangDef;

const LanguageScreen: React.FC = () => {
    const theme: any = useTheme();
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<string>(i18n.language || 'en');

    const dynamic = StyleSheet.create({
        screen: { flex: 1, backgroundColor: theme.background02 ? theme.background02(100) : '#081421' },
        container: { paddingHorizontal: 20, paddingBottom: 120, paddingVertical: 16 },
        searchWrap: { marginBottom: 18 },
        searchInput: { backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220', borderRadius: 12, padding: 12, paddingLeft: 44, color: theme.text01 ? theme.text01(100) : '#fff' },
        searchContainer: { alignSelf: 'center', width: '100%' },
        searchIconWrap: { position: 'absolute', left: 22, top: 18 },
        sectionTitle: { marginTop: 8, marginBottom: 8, textAlign: 'left' as const },
        card: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.background02 ? theme.background02(25) : '#0b1220', backgroundColor: theme.background01 ? theme.background01(100) : '#0b1220' },
        applyWrap: { position: 'absolute', left: 16, right: 16, bottom: 18 },
        applyBtn: { backgroundColor: theme.primary01 ? theme.primary01(100) : '#1e90ff', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
        applyText: { color: '#fff', fontWeight: '600' },
        sectionSpacing: { marginTop: 12 },
        header: { paddingHorizontal: 20, paddingVertical: 12 },
        selectedOutline: { borderWidth: 2, borderColor: theme.primary01 ? theme.primary01(100) : '#3b82f6', borderRadius: 12 },
    });

    const languages = useMemo(() => {
        const q = query.trim().toLowerCase();
        // Use the single LANGS list as the source of truth. Suggested is a filtered subset.
        if (!q) return { suggested: SUGGESTED_LANGS, all: ALL_LANGS };
        const filter = (list: Lang[]) => list.filter(l => (l.name || '').toLowerCase().includes(q) || (l.native || '').toLowerCase().includes(q));
        return { suggested: filter(SUGGESTED_LANGS), all: filter(ALL_LANGS) };
    }, [query]);

    const setAppLanguage = async (lang: string) => {
        try {
            await AsyncStorage.setItem('appLanguage', lang);
        } catch {
            // ignore storage errors
        }
        i18n.changeLanguage(lang).catch(() => { });
        setSelected(lang);
    };

    const renderLang = (item: Lang) => (
        <TouchableOpacity style={selected === item.code ? dynamic.selectedOutline : {}} key={item.code} onPress={() => setAppLanguage(item.code)} activeOpacity={0.7}>
            <SettingListItem
                title={item.name}
                subtitle={item.native}
                rightComponent={selected === item.code ? <Icon name="check" size={24} color={theme.light ? theme.light : '#60a5fa'} /> : null}
            />
        </TouchableOpacity>
    );

    const applySelection = () => {
        setAppLanguage(selected);
    };

    return (
        <SafeAreaView style={dynamic.screen}>
            <View style={dynamic.header}>
                <AuthHeader onBack={() => { }} title={t('language') || 'Language'} />
            </View>
            <FlatList
                contentContainerStyle={dynamic.container}
                data={[]}
                keyExtractor={() => 'lang-list'}
                ListHeaderComponent={
                    <>
                        <SearchTextInput
                            placeholder={t('search') || 'Search'}
                            value={query}
                            onChangeText={setQuery}
                            testID="language-search"
                            containerStyle={dynamic.searchContainer}
                            width={'100%'}
                        />

                        <H4 style={dynamic.sectionTitle}>{t('suggested') || 'SUGGESTED'}</H4>
                        <View style={dynamic.card}>{languages.suggested.map(renderLang)}</View>

                        <H4 style={[dynamic.sectionTitle, dynamic.sectionSpacing]}>{t('all_languages') || 'ALL LANGUAGES'}</H4>
                        <View style={dynamic.card}>{languages.all.map(renderLang)}</View>
                    </>
                }
                renderItem={null}
            />

            <View style={dynamic.applyWrap} pointerEvents="box-none">
                <TouchableOpacity style={dynamic.applyBtn} activeOpacity={0.85} onPress={applySelection}>
                    <Text style={dynamic.applyText}>{t('apply_selection') || 'Apply Selection'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LanguageScreen;
