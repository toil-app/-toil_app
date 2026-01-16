import emojiByNameRaw from './emoji.json';

// Type-safe wrapper for the legacy emoji utility

type EmojiMap = Record<string, string>;
const emojiByName: EmojiMap = emojiByNameRaw as unknown as EmojiMap;

const emojiNameRegex = /:([-+_a-zA-Z0-9]+):/g;
const trimSpaceRegex = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

function stripColons(str: string): string {
  const colonIndex = str.indexOf(':');
  if (colonIndex > -1) {
    if (colonIndex === str.length - 1) {
      return stripColons(str.substring(0, colonIndex));
    }
    return stripColons(str.substr(colonIndex + 1));
  }
  return str;
}

function wrapColons(str: string): string {
  return typeof str === 'string' && str.length > 0 ? `:${str}:` : str;
}

function ensureColons(str: string): string {
  return typeof str === 'string' && str[0] !== ':' ? wrapColons(str) : str;
}

const NON_SPACING_MARK = String.fromCharCode(65039); // 0xFE0F
const nonSpacingRegex = new RegExp(NON_SPACING_MARK, 'g');

function stripNSB(code: string): string {
  return code.replace(nonSpacingRegex, '');
}

// Build reverse lookup: emoji char -> name
const emojiByCode: Record<string, string> = Object.keys(emojiByName).reduce(
  (h, k) => {
    try {
      const v = emojiByName[k];
      h[stripNSB(v)] = k;
    } catch {
      // ignore malformed entries
    }
    return h;
  },
  {} as Record<string, string>,
);

export type EmojiResult = { key: string; emoji: string } | undefined;

function _get(emoji: string): string {
  if (emojiByCode[stripNSB(emoji)]) {
    return emoji;
  } else if (Object.prototype.hasOwnProperty.call(emojiByName, emoji)) {
    return emojiByName[emoji];
  }
  return ensureColons(emoji);
}

export const get = (nameOrCode: string): string => {
  const cleaned = stripColons(nameOrCode);
  return _get(cleaned);
};

export function find(nameOrCode: string): EmojiResult {
  return findByName(nameOrCode) || findByCode(nameOrCode);
}

export function findByName(name: string): EmojiResult {
  const stripped = stripColons(name);
  const e = emojiByName[stripped];
  return e ? { emoji: e, key: stripped } : undefined;
}

export function findByCode(code: string): EmojiResult {
  const stripped = stripNSB(code);
  const name = emojiByCode[stripped];
  return name ? { emoji: emojiByName[name], key: name } : undefined;
}

export function hasEmoji(nameOrCode: string): boolean {
  return hasEmojiByName(nameOrCode) || hasEmojiByCode(nameOrCode);
}

export function hasEmojiByName(name: string): boolean {
  const result = findByName(name);
  return !!result && result.key === stripColons(name);
}

export function hasEmojiByCode(code: string): boolean {
  const result = findByCode(code);
  return !!result && stripNSB(result.emoji) === stripNSB(code);
}

export function which(
  emojiCode: string,
  includeColons = false,
): string | undefined {
  const code = stripNSB(emojiCode);
  const word = emojiByCode[code];
  if (!word) return undefined;
  return includeColons ? wrapColons(word) : word;
}

export function emojify(
  str: string | undefined | null,
  onMissing?: (name: string) => string,
  format?: (emoji: string, name: string) => string,
): string {
  if (!str) return '';

  return str
    .split(emojiNameRegex)
    .map((s, i) => {
      if (i % 2 === 0) return s;
      const emoji = _get(s);
      const isMissing = emoji.indexOf(':') > -1;
      if (isMissing && typeof onMissing === 'function') {
        return onMissing(s);
      }
      if (!isMissing && typeof format === 'function') {
        return format(emoji, s);
      }
      return emoji;
    })
    .join('');
}

export function random(): { key: string; emoji: string } {
  const emojiKeys = Object.keys(emojiByName);
  const randomIndex = Math.floor(Math.random() * emojiKeys.length);
  const key = emojiKeys[randomIndex];
  const e = _get(key);
  return { key, emoji: e };
}

export function search(str: string): Array<{ key: string; emoji: string }> {
  const emojiKeys = Object.keys(emojiByName);
  const matcher = stripColons(str);
  const matchingKeys = emojiKeys.filter(key => key.indexOf(matcher) === 0);
  return matchingKeys.map(key => ({ key, emoji: _get(key) }));
}

export function unemojify(str: string | undefined | null): string {
  if (!str) return '';
  const words = Array.from(str);
  return words
    .map(word => {
      return which(word, true) || word;
    })
    .join('');
}

export function replace(
  str: string | undefined | null,
  replacement: string | ((emoji: { key: string; emoji: string }) => string),
  cleanSpaces = false,
): string {
  if (!str) return '';

  const replaceFn =
    typeof replacement === 'function' ? replacement : () => replacement;
  const words = Array.from(str);

  const replaced = words
    .map((word, idx) => {
      const emoji = findByCode(word);
      if (emoji && cleanSpaces && words[idx + 1] === ' ') {
        // remove the following space
        words[idx + 1] = '';
      }
      return emoji ? replaceFn(emoji) : word;
    })
    .join('');

  return cleanSpaces ? replaced.replace(trimSpaceRegex, '') : replaced;
}

export function strip(str: string | undefined | null): string {
  return replace(str, '', true);
}

const legacyExport = {
  emoji: emojiByName,
  get,
  find,
  findByName,
  findByCode,
  hasEmoji,
  hasEmojiByName,
  hasEmojiByCode,
  which,
  emojify,
  random,
  search,
  unemojify,
  replace,
  strip,
};

// Default export for ESM consumers
export default legacyExport;

// CommonJS compatibility: ensure require(...) returns the same shape
/* istanbul ignore next */
try {
  const g = globalThis as any;
  if (g && g.module && g.module.exports) {
    g.module.exports = legacyExport;
  }
} catch {
  // ignore in non-Node-like environments
}
