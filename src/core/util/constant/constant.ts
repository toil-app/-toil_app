import { getLocales } from 'react-native-localize';

export const DEFAULT_LOCALE = getLocales()[0].languageCode || 'en';
export const DEFAULT_COUNTRY_CODE = getLocales()[0].countryCode || 'US';
export const DEFAULT_LANGUAGE_TAG = getLocales()[0].languageTag || 'en-US';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const PHONE_REGEX =
  /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/;

export const EMAIL_REGEX =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm';
