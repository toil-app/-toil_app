import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Dropdown, { DropdownItem } from './Dropdown';
import LocalStorage from '@core/service/LocalStorage.service';
import { StorageKey } from '@core/util/keys';
import { useTranslation } from 'react-i18next';
import { LANGS } from '@core/util/languages';

type Props = {
  value?: string;
  onChange?: (lang: string) => void;
  boxHeight?: number;
};

const LanguageDropdown: React.FC<Props> = ({ value, onChange, boxHeight }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<string | undefined>(value ?? i18n.language ?? 'en');

  const items: DropdownItem[] = useMemo(
    () => LANGS.map((l) => ({ id: l.code, label: t(l.labelKey || `language_${l.code}`) })),
    [t]
  );

  const handleChange = async (item: DropdownItem) => {
    const lang = String(item.id);
    try {
      await i18n.changeLanguage(lang);
      setSelected(lang);
      try {
        // Persist selected language so app opens with this selection next time
        await LocalStorage.set(StorageKey.SELECTED_LANGUAGE, lang);
      } catch (err) {
        console.warn('Failed to persist selected language', err);
      }
      onChange?.(lang);
    } catch (e) {
      console.warn('Failed to change language', e);
    }
  };

  return (
    <View style={styles.container}>
      <Dropdown
        items={items}
        value={selected}
        onChange={handleChange}
        placeholder={t('select_language')}
        testID="language-dropdown"
        style={styles.dropdown}
        boxHeight={boxHeight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
  },
  dropdown: {
    width: '100%',
  },
});

export default LanguageDropdown;
