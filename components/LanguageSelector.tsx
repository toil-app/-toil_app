import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const LANGS = [
    { code: 'en', labelKey: 'language_en' },
    { code: 'sl', labelKey: 'language_sl' },
    { code: 'ta', labelKey: 'language_ta' },
    { code: 'si', labelKey: 'language_si' }, // <-- added Sinhala
];

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [current, setCurrent] = useState(i18n.language || 'en');

    async function onSelect(lang: string) {
        await i18n.changeLanguage(lang);
        setCurrent(lang);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('select_language')}</Text>
            <Text style={styles.current}>{t('current_language', { language: current })}</Text>
            <View style={styles.row}>
                {LANGS.map((l) => (
                    <TouchableOpacity
                        key={l.code}
                        onPress={() => onSelect(l.code)}
                        style={[styles.button, current === l.code && styles.active]}
                    >
                        <Text style={styles.buttonText}>{t(l.labelKey)}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: '600',
        marginBottom: 6,
    },
    current: {
        marginBottom: 8,
        color: '#444',
    },
    row: {
        flexDirection: 'row',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        backgroundColor: '#eee',
        borderRadius: 6,
    },
    active: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#000',
    },
});
