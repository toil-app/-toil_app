// Type-safe TypeScript wrapper for emoji utilities using `emojilib`.
// import emojilib from 'emojilib';
import * as emojilib from './emoji.json';
import charRegex from 'char-regex';
import skinTone from 'skin-tone';

const charRegexMatcher = charRegex();

const NON_SPACING_MARK = String.fromCharCode(65039);
const nonSpacingRegex = new RegExp(NON_SPACING_MARK, 'g');

function normalizeCode(code: string): string {
  return code.replace(nonSpacingRegex, '');
}

function normalizeName(name: string): string {
  return /^:.+:$/.test(name) ? name.slice(1, -1) : name;
}

type EmojiData = [string, string];

const emojiData: EmojiData[] = Object.entries((emojilib as any).lib || {}).map(
  ([name, info]: any) => [name, info.char],
);
const emojiCodesByName: Map<string, string> = new Map(emojiData);
const emojiNamesByCode: Map<string, string> = new Map(
  emojiData.map(([name, emoji]) => [normalizeCode(emoji), name]),
);

function findByName(name: string): { emoji: string; key: string } | undefined {
  if (typeof name !== 'string') throw new TypeError('name must be a string');
  const key = normalizeName(name);
  const emoji = emojiCodesByName.get(key);
  return emoji ? { emoji, key } : undefined;
}

function findByCode(code: string): { emoji: string; key: string } | undefined {
  if (typeof code !== 'string') throw new TypeError('code must be a string');
  const emojiNormalized = normalizeCode(code);
  const key = emojiNamesByCode.get(emojiNormalized);
  return key ? { emoji: emojiNormalized, key } : undefined;
}

export function find(
  codeOrName: string,
): { emoji: string; key: string } | undefined {
  return findByCode(codeOrName) ?? findByName(codeOrName);
}

// export function get(codeOrName: string): string | undefined {
//   if (typeof codeOrName !== 'string')
//     throw new TypeError('codeOrName must be a string');
//   emojiCodesByName.get(normalizeName(codeOrName));
//   console.log(emojilib, 'Getting emoji for', codeOrName);

//   console.log('emojiCodesByName:', emojiValues);
//   return codeOrName;
// }

export const get = (name: string): string | undefined => {
  if (typeof name !== 'string') throw new TypeError('name must be a string');
  console.log(emojilib, 'Getting emoji for', name);
  const emoji = normalizeName(name);
  return (emojilib as any)[emoji];
};

export function has(codeOrName: string): boolean {
  if (typeof codeOrName !== 'string')
    throw new TypeError('codeOrName must be a string');
  return (
    emojiCodesByName.has(normalizeName(codeOrName)) ||
    emojiNamesByCode.has(normalizeCode(codeOrName))
  );
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function random(): { emoji: string; name: string } {
  const [name, emoji] = randomItem(emojiData);
  return { emoji, name };
}

type ReplaceCallback = (
  found: { emoji: string; key: string },
  index: number,
  input: string,
) => string;

export function replace(
  input: string,
  replacement: string | ReplaceCallback,
  options?: { preserveSpaces?: boolean },
): string {
  const { preserveSpaces = false } = options || {};
  if (typeof input !== 'string') throw new TypeError('input must be a string');
  const replaceFn: ReplaceCallback =
    typeof replacement === 'function'
      ? (replacement as ReplaceCallback)
      : () => replacement as string;

  const characters = input.match(charRegexMatcher);
  if (characters === null) return input;

  return characters
    .map((character, index) => {
      const found = findByCode(character);
      if (!found) return character;
      if (!preserveSpaces && characters[index + 1] === ' ')
        characters[index + 1] = '';
      return replaceFn(found, index, input);
    })
    .join('');
}

export function strip(
  input: string,
  options?: { preserveSpaces?: boolean },
): string {
  return replace(input, '', options);
}

export function search(
  keyword: string | RegExp,
): Array<{ emoji: string; name: string }> {
  if (typeof keyword === 'string') {
    keyword = normalizeName(keyword);
  }
  if (keyword instanceof RegExp) {
    const normalizedPattern = normalizeName((keyword as RegExp).source);
    keyword = new RegExp(normalizedPattern);
  }
  return emojiData
    .filter(([name]) => name.match(keyword as RegExp | string))
    .map(([name, emoji]) => ({ emoji, name }));
}

export function emojify(
  input: string,
  opts?: {
    fallback?: ((name: string) => string) | string;
    format?: (emoji: string, token?: string, input?: string) => string;
  },
): string {
  const { fallback, format = (n: string) => n } = opts || {};
  const fallbackFn =
    typeof fallback === 'function'
      ? (fallback as (name: string) => string)
      : typeof fallback === 'string'
      ? () => fallback as string
      : undefined;
  if (typeof input !== 'string') throw new TypeError('input must be a string');
  return input.replace(/:[\w\-+]+:/g, part => {
    const found = findByName(part);
    if (found) return format(found.emoji, part, input);
    if (fallbackFn) return format(fallbackFn(normalizeName(part)));
    return format(part);
  });
}

export function which(
  emoji: string,
  opts?: { markdown?: boolean },
): string | undefined {
  const { markdown = false } = opts || {};
  if (typeof emoji !== 'string') throw new TypeError('emoji must be a string');
  const result = findByCode(skinTone(emoji, 'none'));
  if (result === undefined) return undefined;
  return markdown ? `:${result.key}:` : result.key;
}

export function unemojify(input: string): string {
  if (typeof input !== 'string') throw new TypeError('input must be a string');
  const characters = input.match(charRegexMatcher);
  if (characters === null) return input;
  return characters
    .map(character => which(character, { markdown: true }) ?? character)
    .join('');
}

/**
 * Return all emoji names available in the underlying emojilib dataset.
 * Names are the short identifiers like 'thumbsup', 'flag_us', etc.
 */
export function getAllEmojiNames(): string[] {
  return Array.from(emojiCodesByName.keys());
}
