import { layout } from '@core/util/Theme/layout';
import { StyleSheet, TextStyle } from 'react-native';
import { Font } from './FontConfig';
import {
  getFontSize,
  getLineHeight,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getSpacing,
} from '@core/util/Theme/layout';

export type Typography = {
  hero1: TextStyle;
  hero2: TextStyle;
  s2: TextStyle;
};

/**
 * Returns a responsive typography scale based on provided Font config.
 * - Uses safe fallbacks when a font family is not provided.
 * - Uses layout helpers so values scale across screen sizes.
 */
export const getTypography = (font: Font): Typography => {
  const familyBold = font?.bold ?? font?.semiBold ?? font?.regular ?? undefined;
  const familyRegular = font?.regular ?? familyBold;

  // compute sizes using layout helpers (small, medium, large)
  const hero1Size = getFontSize(64, 72, 80);
  const hero1Line = getLineHeight(72, 80, 88);

  const hero2Size = getFontSize(40, 45, 50);
  const hero2Line = getLineHeight(48, 52, 56);

  const s2Size = getFontSize(14, 16, 18);
  const s2Line = getLineHeight(20, 22, 24);

  return {
    hero1: {
      fontFamily: familyBold,
      fontSize: hero1Size,
      lineHeight: hero1Line,
    },
    hero2: {
      fontFamily: familyBold,
      fontSize: hero2Size,
      lineHeight: hero2Line,
    },
    s2: {
      fontFamily: familyRegular,
      fontSize: s2Size,
      lineHeight: s2Line,
    },
  };
};

/**
 * Link styles based on typography. Uses StyleSheet.create for performance.
 * Consumers can spread these into Text components or re-use keys.
 */
export const getLinkStyles = (font: Font) =>
  StyleSheet.create({
    extraLarge: {
      ...getTypography(font).s2,
      fontFamily: font?.bold ?? font?.regular,
      textDecorationLine: 'underline',
    },
    large: {
      ...getTypography(font).s2,
      textDecorationLine: 'underline',
    },
  });

// Convenience exports for common responsive helpers used by components
export const responsive = {
  // friendly wrappers exposing layout helpers for consumers of the theme
  baseBreakpoints: layout.breakpoints,
  getResponsiveWidth: (size: number) => getResponsiveFontSize(size), // useful for scaling icon/text sizes
  getResponsiveSpacing: (size: number) => getResponsiveSpacing(size),
  getSpacing,
};
