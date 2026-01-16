export type Lang = {
  code: string;
  name?: string;
  native?: string;
  labelKey?: string; // i18n key for dropdown labels
  suggested?: boolean;
};

// Single source of truth for all languages. Mark some as `suggested` for use at the top
// of the Language screen. This array is used by both the dropdown and the full language
// selection screen.
export const LANGS: Lang[] = [
  {
    code: 'en',
    name: 'English',
    native: 'English (US)',
    labelKey: 'language_en',
    suggested: true,
  },
  {
    code: 'si',
    name: 'Sinhala',
    native: 'සිංහල',
    labelKey: 'language_si',
    suggested: true,
  },
  {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    labelKey: 'language_ta',
    suggested: true,
  },
  {
    code: 'sl',
    name: 'Slovenian',
    native: 'Slovenščina',
    labelKey: 'language_sl',
    suggested: true,
  },

  // other languages (not suggested by default)
  { code: 'de', name: 'German', native: 'Deutsch', labelKey: 'language_de' },
  { code: 'it', name: 'Italian', native: 'Italiano', labelKey: 'language_it' },
  {
    code: 'pt',
    name: 'Portuguese',
    native: 'Português',
    labelKey: 'language_pt',
  },
  { code: 'zh', name: 'Chinese', native: '中文', labelKey: 'language_zh' },
  { code: 'ja', name: 'Japanese', native: '日本語', labelKey: 'language_ja' },
  { code: 'ru', name: 'Russian', native: 'Русский', labelKey: 'language_ru' },
  { code: 'es', name: 'Spanish', native: 'Español', labelKey: 'language_es' },
  { code: 'fr', name: 'French', native: 'Français', labelKey: 'language_fr' },
];

export const SUGGESTED_LANGS = LANGS.filter(l => l.suggested);
export const ALL_LANGS = LANGS;

// For small dropdowns that only need id + labelKey, callers can map `LANGS` as needed.
